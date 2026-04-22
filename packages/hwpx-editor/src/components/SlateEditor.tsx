import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties
} from 'react';
import {
  createEditor,
  Transforms,
  Editor,
  Element as SlateElement,
  Node,
  Path,
  Point,
  Range,
  type Descendant
} from 'slate';
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  type RenderElementProps,
  type RenderLeafProps
} from 'slate-react';
import { withHistory } from 'slate-history';
import styled from '@emotion/styled';
import { Button, Badge, Flex, colors, radius } from '@bichon/ds';
import { useEditor } from './EditorProvider';
import { isVoidElement, type HwpxElement } from '../schema';
import { withRefIdNormalizer } from '../plugins/refid-normalizer';
import { withTableStructureLock } from '../plugins/table-structure-lock';
import { createTableNavigationHandler } from '../plugins/with-table-navigation';
import {
  createTableCellSelectionHandler,
  collectCellPathsBetween
} from '../plugins/with-table-cell-selection';
import type { DiffSession } from '../diff/use-diff-session';
import {
  useDiffTargets,
  buildPreviewHtml,
  buildTableGroupPreviewHtml,
  DiffWidget,
  injectDiffStyles
} from './slate-diff-decoration';
import type { TableElement } from '../schema/types';
import { bichonDiffTokens } from './bichon-diff-tokens';

/** HWP 단위 → px (÷75, Rust page_properties_to_css와 동일) */
function hwpUnitToPx(value: number): number {
  return value / 75;
}

/** HWPX 단위(1/7200 inch) → CSS px */
function hwpxToPx(val: number | null): string | undefined {
  if (!val) return undefined;
  return `${Math.round((val / 7200) * 96)}px`;
}

export interface SlateEditorProps {
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  readOnly?: boolean;
  diffSession?: DiffSession;
  onDismiss?: () => void;
}

const EditorContainer = styled.div<{ $width: string; $height: string }>`
  width: ${(p) => p.$width};
  max-width: 100%;
  height: ${(p) => p.$height};
  overflow: auto;
  background: white;

  /* 셀 선택 모드: 네이티브 텍스트 선택 숨김 */
  &[data-cell-selecting] [data-slate-editor] ::selection {
    background: transparent !important;
  }

  /* 선택된 셀 하이라이트 */
  & td[data-cell-selected] {
    background-color: rgba(59, 130, 246, 0.15) !important;
  }
`;

const EditorInner = styled.div<{ $padding: string }>`
  box-sizing: border-box;
  min-height: 100%;
  padding: ${(p) => p.$padding};

  /* 에디터 본문은 문서 자체 폰트를 유지 */
  [data-slate-editor] {
    outline: none;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: serif;
  }

  /* inline run 내 빈 텍스트의 <br> 줄바꿈 방지 */
  [data-run-style] [data-slate-zero-width] br {
    display: none;
  }
`;

const DiffOverlay = styled(Flex)`
  justify-content: center;
  position: sticky;
  bottom: 8px;
  margin: 0 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border: 1px solid ${colors.lineDefault};
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
`;

const NavButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: ${radius.sm};
  background: transparent;
  color: ${colors.textSecondary};
  cursor: pointer;
  &:hover {
    background: ${colors.bgLightGrey};
  }
  &:disabled {
    color: ${colors.textDisabled};
    cursor: default;
  }
`;

const NavCount = styled.span`
  font-size: 13px;
  color: ${colors.textTertiary};
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
`;

function toCssLength(
  v: CSSProperties['width'] | undefined,
  fallback: string
): string {
  if (v == null) return fallback;
  return typeof v === 'number' ? `${v}px` : v;
}

function RenderElement({
  attributes,
  children,
  element,
  diffTargets,
  diffSession,
  editorValue
}: RenderElementProps & {
  diffTargets?: Map<string, import('./slate-diff-decoration').DiffTarget[]>;
  diffSession?: DiffSession;
  editorValue?: Descendant[];
}) {
  const el = element as HwpxElement;

  // Diff 하이라이트 및 위젯 렌더링
  let diffHighlightType: 'update' | 'delete' | undefined;
  const widgetsBefore: React.ReactNode[] = [];
  const widgetsAfter: React.ReactNode[] = [];

  if (diffTargets && diffSession && editorValue && 'refId' in el && el.refId) {
    const targetList = diffTargets.get(el.refId);
    if (targetList) {
      // 같은 refId의 non-table-child 타겟들을 위치별로 그룹화하여 단일 위젯으로 합침
      const beforeTargets: import('./slate-diff-decoration').DiffTarget[] = [];
      const afterTargets: import('./slate-diff-decoration').DiffTarget[] = [];

      for (const target of targetList) {
        if (target.isTableChild) continue;

        if (target.actionType === 'update' || target.actionType === 'delete') {
          diffHighlightType = target.actionType;
        }

        if (target.actionType === 'add' && target.position === 'before') {
          beforeTargets.push(target);
        } else {
          afterTargets.push(target);
        }
      }

      // before 위치 그룹 → 단일 위젯
      if (beforeTargets.length > 0) {
        const groupIndices = beforeTargets.map((t) => t.entryIndex);
        const combinedHtml = beforeTargets
          .map((t) => diffSession.entries[t.entryIndex])
          .filter(Boolean)
          .map((entry) => buildPreviewHtml(entry!, editorValue))
          .join('');
        const primaryType = beforeTargets.some(
          (t) => t.actionType === 'update' || t.actionType === 'delete'
        )
          ? (beforeTargets.find((t) => t.actionType === 'update')?.actionType ??
            beforeTargets[0]!.actionType)
          : beforeTargets[0]!.actionType;

        widgetsBefore.push(
          <DiffWidget
            key={`diff-before-${groupIndices.join('-')}`}
            type={primaryType as 'update' | 'add' | 'delete'}
            previewHtml={combinedHtml}
            onAccept={() => diffSession.acceptEntries(groupIndices)}
            onReject={() => diffSession.rejectEntries(groupIndices)}
          />
        );
      }

      // after 위치 그룹 → 단일 위젯
      if (afterTargets.length > 0) {
        const groupIndices = afterTargets.map((t) => t.entryIndex);
        const combinedHtml = afterTargets
          .map((t) => diffSession.entries[t.entryIndex])
          .filter(Boolean)
          .map((entry) => buildPreviewHtml(entry!, editorValue))
          .join('');
        const primaryType = afterTargets.some((t) => t.actionType === 'update')
          ? 'update'
          : afterTargets.some((t) => t.actionType === 'delete')
            ? 'delete'
            : afterTargets[0]!.actionType;

        widgetsAfter.push(
          <DiffWidget
            key={`diff-after-${groupIndices.join('-')}`}
            type={primaryType as 'update' | 'add' | 'delete'}
            previewHtml={combinedHtml}
            onAccept={() => diffSession.acceptEntries(groupIndices)}
            onReject={() => diffSession.rejectEntries(groupIndices)}
          />
        );
      }
    }
  }

  switch (el.type) {
    case 'paragraph': {
      const hasWidgets = widgetsBefore.length > 0 || widgetsAfter.length > 0;
      if (hasWidgets) {
        // 위젯이 있으면 래퍼 div로 감싸서 위젯이 data-style 밖에 위치하도록 함
        // (StyleResolver CSS가 위젯 preview 콘텐츠에 상속되는 문제 방지)
        return (
          <div {...attributes}>
            {widgetsBefore}
            <div
              data-style={el.style ?? undefined}
              data-ref-id={el.refId ?? undefined}
              data-diff-type={diffHighlightType ?? undefined}
            >
              {children}
            </div>
            {widgetsAfter}
          </div>
        );
      }
      return (
        <div
          {...attributes}
          data-style={el.style ?? undefined}
          data-ref-id={el.refId ?? undefined}
        >
          {children}
        </div>
      );
    }

    case 'run':
      return (
        <div
          {...attributes}
          data-run-style={el.style ?? undefined}
          data-ref-id={el.refId ?? undefined}
          style={{ display: 'inline' }}
        >
          {children}
        </div>
      );

    case 't':
      return <span {...attributes}>{children}</span>;

    case 'table': {
      const cssWidth = hwpxToPx(el.width);
      // 테이블 자식 액션이 있으면 통합 그룹 위젯 렌더링
      const tableTargetList = diffTargets?.get(el.refId ?? '');
      const tableGroupTargets = tableTargetList?.filter((t) => t.isTableChild);
      const hasTableGroup = tableGroupTargets && tableGroupTargets.length > 0;

      let tableGroupWidget: React.ReactNode = null;
      if (hasTableGroup && diffSession && editorValue) {
        const hasAddOrUpdate = tableGroupTargets.some(
          (t) => t.actionType === 'add' || t.actionType === 'update'
        );
        const previewHtml = buildTableGroupPreviewHtml(
          el as unknown as TableElement,
          tableGroupTargets,
          diffSession.entries
        );
        const groupIndices = tableGroupTargets.map((t) => t.entryIndex);
        tableGroupWidget = (
          <DiffWidget
            type={hasAddOrUpdate ? 'add' : 'delete'}
            previewHtml={previewHtml}
            onAccept={() => diffSession.acceptEntries(groupIndices)}
            onReject={() => diffSession.rejectEntries(groupIndices)}
          />
        );
      }

      const isInlineTable = el.treat_as_char != null && el.treat_as_char !== 0;
      const tableStyle: CSSProperties = {
        borderCollapse: 'collapse' as const,
        tableLayout: 'fixed' as const,
        ...(cssWidth ? { width: cssWidth } : {}),
        ...(hasTableGroup ? { background: '#fef9c3' } : {}),
        ...(isInlineTable
          ? { display: 'inline-table', verticalAlign: 'middle' }
          : {})
      };
      const tableDataAttrs = {
        ...(isInlineTable ? { 'data-inline-table': '' } : {})
      };

      if (hasTableGroup) {
        // div 래퍼로 감싸서 테이블 뒤에 통합 위젯 배치
        return (
          <div {...attributes}>
            <table
              data-style={el.style ?? undefined}
              data-ref-id={el.refId ?? undefined}
              {...tableDataAttrs}
              style={tableStyle}
            >
              <tbody>{children}</tbody>
            </table>
            {tableGroupWidget}
          </div>
        );
      }

      return (
        <table
          {...attributes}
          data-style={el.style ?? undefined}
          data-ref-id={el.refId ?? undefined}
          {...tableDataAttrs}
          style={tableStyle}
        >
          <tbody>{children}</tbody>
        </table>
      );
    }

    case 'table_row': {
      // 테이블 그룹 대상 row는 개별 위젯을 표시하지 않음 (parent table에서 통합 위젯 생성)
      return (
        <tr {...attributes} data-ref-id={el.refId ?? undefined}>
          {children}
        </tr>
      );
    }

    case 'table_cell': {
      const cellW = hwpxToPx(el.width);
      const cellH = hwpxToPx(el.height);
      return (
        <td
          {...attributes}
          data-style={el.style ?? undefined}
          data-ref-id={el.refId ?? undefined}
          rowSpan={el.rowspan}
          colSpan={el.colspan}
          style={{
            ...(cellW ? { width: cellW } : {}),
            ...(cellH ? { height: cellH } : {})
          }}
        >
          {children}
        </td>
      );
    }

    case 'pic': {
      return (
        <span
          {...attributes}
          contentEditable={false}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
        >
          <img
            data-hwpx-image={el.name}
            data-ref-id={el.refId ?? undefined}
            src={el.src}
            alt={el.alt ?? el.name}
            {...(el.width ? { width: el.width } : {})}
            {...(el.height ? { height: el.height } : {})}
            style={{
              verticalAlign: 'middle',
              userSelect: 'none'
            }}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          />
          {children}
        </span>
      );
    }

    case 'sub_list':
      return (
        <div
          {...attributes}
          data-ref-id={el.refId ?? undefined}
          style={{ display: 'inline' }}
        >
          {children}
        </div>
      );

    default:
      return <div {...attributes}>{children}</div>;
  }
}

function RenderLeaf({ attributes, children }: RenderLeafProps) {
  return <span {...attributes}>{children}</span>;
}

export function SlateEditor({
  width,
  height,
  readOnly,
  diffSession,
  onDismiss
}: SlateEditorProps) {
  const {
    value,
    setValue,
    loadCount,
    pageProperties,
    notifyEditorStateChange,
    editorRef,
    dispatcher
  } = useEditor();

  const hasDiff = diffSession && diffSession.entries.length > 0;
  const diffTargets = useDiffTargets(diffSession?.entries ?? [], value);

  // Inject diff CSS on mount
  useEffect(() => {
    injectDiffStyles(bichonDiffTokens);
  }, []);

  const editor = useMemo(() => {
    const e = withTableStructureLock(
      withRefIdNormalizer(withHistory(withReact(createEditor())))
    );

    const { isVoid: originalIsVoid, isInline: originalIsInline } = e;
    e.isVoid = (element) => {
      return isVoidElement(element) || originalIsVoid(element);
    };
    e.isInline = (element) => {
      return originalIsInline(element);
    };

    // Enter 키: paragraph를 split하여 새 단락 생성
    // split_node이 style을 자동 복사하고, withRefIdNormalizer의 apply 인터셉트가 refId를 null로 처리
    // (style이 null인 경우 withRefIdNormalizer의 normalizeNode가 이전 sibling에서 상속)
    e.insertBreak = () => {
      const { selection } = e;
      if (!selection) return;

      Transforms.splitNodes(e, {
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n.type === 'paragraph',
        always: true
      });
    };

    // 붙여넣기 시 항상 plain text만 삽입 (구조 복사 방지)
    e.insertData = (data: DataTransfer) => {
      const text = data.getData('text/plain');
      if (text) {
        e.insertText(text);
      }
    };

    // Backspace로 문단 병합 시 void(pic) 포함 run이 있는 경우를 처리한다.
    // Slate 기본 deleteBackward는 void를 삭제하지 못하면(isTableStructureOp 차단)
    // 후속 mergeNodes에서 t를 void-run에 병합하여 텍스트가 소실되는 버그가 있다.
    // 이를 방지하기 위해 run 단위로 이동하여 문단만 병합하고 run 계층 병합을 생략한다.
    {
      const { deleteBackward } = e;
      e.deleteBackward = (unit) => {
        const { selection } = e;
        if (selection && Range.isCollapsed(selection)) {
          const paraEntry = Editor.above(e, {
            match: (n) => SlateElement.isElement(n) && n.type === 'paragraph'
          });
          if (paraEntry) {
            const [, paraPath] = paraEntry;
            const paraStart = Editor.start(e, paraPath);
            const lastIdx = paraPath[paraPath.length - 1] ?? 0;
            if (Point.equals(selection.anchor, paraStart) && lastIdx > 0) {
              // 이전 형제 문단의 마지막 run에 void 요소가 있는지 확인
              const prevPath = Path.previous(paraPath);
              const [prevNode] = Editor.node(e, prevPath);
              if (
                SlateElement.isElement(prevNode) &&
                prevNode.type === 'paragraph'
              ) {
                const lastRun = prevNode.children[prevNode.children.length - 1];
                const hasVoid =
                  lastRun &&
                  SlateElement.isElement(lastRun) &&
                  lastRun.children.some(
                    (c: any) => SlateElement.isElement(c) && e.isVoid(c)
                  );
                if (hasVoid) {
                  // run 단위로 이동하여 문단만 병합 (run 계층 cascading merge 방지)
                  const [curPara] = Editor.node(e, paraPath);
                  if (SlateElement.isElement(curPara)) {
                    const childCount = curPara.children.length;
                    Editor.withoutNormalizing(e, () => {
                      for (let i = childCount - 1; i >= 0; i--) {
                        Transforms.moveNodes(e, {
                          at: [...paraPath, i],
                          to: [...prevPath, prevNode.children.length]
                        });
                      }
                      Transforms.removeNodes(e, { at: paraPath });
                    });
                  }
                  return;
                }
              }
            }
          }
        }
        deleteBackward(unit);
      };
    }

    editorRef.current = e;
    return e;
    // loadCount가 바뀌면 새 editor 인스턴스 생성 (Slate 리마운트 시 필요)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadCount]);

  const handleTableNavigation = useMemo(
    () => createTableNavigationHandler(editor),
    [editor]
  );

  // ── 셀 선택 (마우스 드래그) ──
  const cellDragRef = useRef<{
    anchorCellPath: Path | null;
    tablePath: Path | null;
  }>({ anchorCellPath: null, tablePath: null });
  const cellSelectionRef = useRef<Path[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const clearCellSelection = useCallback(() => {
    cellSelectionRef.current = [];
    containerRef.current
      ?.querySelectorAll('td[data-cell-selected]')
      .forEach((el) => {
        el.removeAttribute('data-cell-selected');
      });
    containerRef.current?.removeAttribute('data-cell-selecting');
  }, []);

  const applyCellHighlights = useCallback(
    (paths: Path[]) => {
      // 기존 하이라이트 제거
      containerRef.current
        ?.querySelectorAll('td[data-cell-selected]')
        .forEach((el) => {
          el.removeAttribute('data-cell-selected');
        });

      for (const path of paths) {
        try {
          const node = Node.get(editor, path);
          const domNode = ReactEditor.toDOMNode(editor, node as SlateElement);
          domNode.setAttribute('data-cell-selected', '');
        } catch {
          /* 노드가 마운트되지 않은 경우 무시 */
        }
      }

      cellSelectionRef.current = paths;

      if (paths.length > 0) {
        containerRef.current?.setAttribute('data-cell-selecting', '');
        window.getSelection()?.removeAllRanges();
      }
    },
    [editor]
  );

  const handleCellMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      clearCellSelection();

      const td = (event.target as HTMLElement).closest(
        'td[data-slate-node]'
      ) as HTMLElement | null;
      if (!td) {
        cellDragRef.current = { anchorCellPath: null, tablePath: null };
        return;
      }

      try {
        const slateNode = ReactEditor.toSlateNode(editor, td);
        if (
          !SlateElement.isElement(slateNode) ||
          (slateNode as any).type !== 'table_cell'
        ) {
          cellDragRef.current = { anchorCellPath: null, tablePath: null };
          return;
        }
        const cellPath = ReactEditor.findPath(editor, slateNode);
        const tableEntry = Editor.above(editor, {
          at: cellPath,
          match: (n) => SlateElement.isElement(n) && n.type === 'table'
        });
        if (!tableEntry) {
          cellDragRef.current = { anchorCellPath: null, tablePath: null };
          return;
        }
        cellDragRef.current = {
          anchorCellPath: cellPath,
          tablePath: tableEntry[1]
        };

        const onMouseMove = (e: MouseEvent) => {
          const { anchorCellPath, tablePath } = cellDragRef.current;
          if (!anchorCellPath || !tablePath) return;

          const el = document.elementFromPoint(e.clientX, e.clientY);
          const moveTd = el?.closest(
            'td[data-slate-node]'
          ) as HTMLElement | null;
          if (!moveTd) return;

          try {
            const moveNode = ReactEditor.toSlateNode(editor, moveTd);
            if (
              !SlateElement.isElement(moveNode) ||
              (moveNode as any).type !== 'table_cell'
            )
              return;
            const moveCellPath = ReactEditor.findPath(editor, moveNode);

            // 같은 셀이면 일반 텍스트 선택
            if (Path.equals(moveCellPath, anchorCellPath)) {
              if (cellSelectionRef.current.length > 0) clearCellSelection();
              return;
            }

            // 같은 테이블 확인
            const moveTable = Editor.above(editor, {
              at: moveCellPath,
              match: (n) => SlateElement.isElement(n) && n.type === 'table'
            });
            if (!moveTable || !Path.equals(moveTable[1], tablePath)) return;

            const paths = collectCellPathsBetween(
              editor,
              tablePath,
              anchorCellPath,
              moveCellPath
            );
            applyCellHighlights(paths);
          } catch {
            /* ignore */
          }
        };

        const onMouseUp = () => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      } catch {
        cellDragRef.current = { anchorCellPath: null, tablePath: null };
      }
    },
    [editor, clearCellSelection, applyCellHighlights]
  );

  const handleTableCellSelection = useMemo(
    () =>
      createTableCellSelectionHandler(
        editor,
        () => cellSelectionRef.current,
        clearCellSelection
      ),
    [editor, clearCellSelection]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      handleTableCellSelection(event);
      if (!event.defaultPrevented) {
        handleTableNavigation(event);
      }
    },
    [handleTableCellSelection, handleTableNavigation]
  );

  const pp = pageProperties;
  const $width = toCssLength(width, pp ? `${hwpUnitToPx(pp.width)}px` : '100%');
  const $height = toCssLength(
    height,
    pp ? `${hwpUnitToPx(pp.height)}px` : 'auto'
  );
  const $padding = pp
    ? `${hwpUnitToPx(pp.marginTop)}px ${hwpUnitToPx(pp.marginRight)}px ${hwpUnitToPx(pp.marginBottom)}px ${hwpUnitToPx(pp.marginLeft)}px`
    : '0';

  const valueRef = useRef(value);
  valueRef.current = value;

  const renderElement = useCallback(
    (props: RenderElementProps) => (
      <RenderElement
        {...props}
        diffTargets={hasDiff ? diffTargets : undefined}
        diffSession={diffSession}
        editorValue={hasDiff ? valueRef.current : undefined}
      />
    ),
    [hasDiff, diffTargets, diffSession]
  );

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <RenderLeaf {...props} />,
    []
  );

  const handleChange = useCallback(
    (_newValue: Descendant[]) => {
      // selection-only 변경(화살표 키 이동 등)에서는 비싼 XML 직렬화/비교를 스킵하여
      // 메인 스레드 블로킹으로 인한 키 이벤트 누적(여러 줄 건너뜀)을 방지한다.
      const hasContentChange = editor.operations.some(
        (op) => op.type !== 'set_selection'
      );

      if (hasContentChange && !dispatcher.isSyncing && !hasDiff) {
        dispatcher.scheduleDirty(editor);
      }

      if (hasContentChange) {
        // dispatchDirty가 applyRefIdsFromFlat으로 editor.children을 변경했을 수 있으므로
        // stale 참조인 newValue 대신 최신 editor.children을 사용한다.
        setValue(editor.children);
      }

      // 툴바 상태 업데이트 등을 위해 selection 변경에도 notify
      notifyEditorStateChange();
    },
    [editor, setValue, dispatcher, notifyEditorStateChange, hasDiff]
  );

  // Diff overlay navigation
  const totalCount = diffSession?.entries.length ?? 0;
  const checkedCount =
    diffSession?.entries.filter((e) => e.checked).length ?? 0;
  const [navIndex, setNavIndex] = useState(0);

  useEffect(() => {
    setNavIndex(0);
  }, [totalCount]);

  const navigateDiff = useCallback((direction: 'prev' | 'next') => {
    const widgets = containerRef.current?.querySelectorAll('.hwpx-diff-widget');
    if (!widgets || widgets.length === 0) return;
    const maxIdx = widgets.length - 1;
    setNavIndex((prev) => {
      const next =
        direction === 'next'
          ? Math.min(prev + 1, maxIdx)
          : Math.max(prev - 1, 0);
      widgets[next]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return next;
    });
  }, []);

  return (
    <EditorContainer ref={containerRef} $width={$width} $height={$height}>
      <EditorInner $padding={$padding}>
        <Slate
          key={loadCount}
          editor={editor}
          initialValue={value}
          onChange={handleChange}
        >
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            readOnly={readOnly || !!hasDiff}
            onKeyDown={handleKeyDown}
            onMouseDown={handleCellMouseDown}
          />
        </Slate>
      </EditorInner>
      {hasDiff && (
        <DiffOverlay gap={8} alignItems="center">
          {diffSession!.status === 'streaming' && (
            <Badge variant="active" size="small">
              수신 중...
            </Badge>
          )}
          <NavButton
            onClick={() => navigateDiff('prev')}
            disabled={navIndex <= 0}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3.5 8.75L7 5.25L10.5 8.75"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </NavButton>
          <NavCount>
            {navIndex + 1}/{totalCount}
          </NavCount>
          <NavButton
            onClick={() => navigateDiff('next')}
            disabled={navIndex >= totalCount - 1}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3.5 5.25L7 8.75L10.5 5.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </NavButton>
          <Button
            variant="filled"
            size="small"
            onClick={diffSession!.applyChecked}
            disabled={checkedCount === 0 || diffSession!.status === 'streaming'}
          >
            전체 수락 ({checkedCount})
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={onDismiss ?? diffSession!.reset}
          >
            전체 무시
          </Button>
        </DiffOverlay>
      )}
    </EditorContainer>
  );
}
