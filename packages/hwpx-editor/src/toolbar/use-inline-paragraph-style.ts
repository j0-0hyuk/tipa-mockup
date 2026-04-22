import { useCallback, useMemo, useSyncExternalStore } from "react";
import { Transforms, Editor, Element as SlateElement, type Path } from "slate";
import type {
  ParagraphStyle,
  CharacterStyle,
  Mark,
  AlignType,
} from "@docshunt/docs-editor-wasm";
import { useEditor } from "../components/EditorProvider";
import type { ParagraphElement, RunElement } from "../schema";

export interface InlineParagraphStyleValues {
  /** Current style key of the paragraph at cursor (null if no selection) */
  styleKey: string | null;
  /** 줄간격 */
  lineSpacing: number | null;
  /** 정렬 */
  align: AlignType | null;
  /** 문단 위 간격 */
  marginTop: number | null;
  /** 문단 아래 간격 */
  marginBottom: number | null;
  /** 글머리 기호 */
  mark: Mark | undefined | null;
  /** 들여쓰기 */
  outdent: number | null;
  /** 글꼴 */
  fontFace: string[] | null;
  /** 글꼴 크기 */
  fontSize: number | null;
  /** 굵게 */
  bold: boolean | null;
}

export interface UseInlineParagraphStyleReturn {
  /** 현재 커서 위치 문단의 해석된 스타일 속성들 */
  values: InlineParagraphStyleValues;
  /** 선택된 문단에 인라인 paragraph 속성 적용 */
  setParagraphProperty: (
    property: keyof ParagraphStyle,
    value: number | string | Mark | null | undefined,
  ) => void;
  /** 선택된 문단에 인라인 character 속성 적용 */
  setCharacterProperty: (
    property: keyof CharacterStyle,
    value: number | string | string[] | boolean | null | undefined,
  ) => void;
}

const NULL_VALUES: InlineParagraphStyleValues = {
  styleKey: null,
  lineSpacing: null,
  align: null,
  marginTop: null,
  marginBottom: null,
  mark: null,
  outdent: null,
  fontFace: null,
  fontSize: null,
  bold: null,
};

export function useInlineParagraphStyle(): UseInlineParagraphStyleReturn {
  const { store, editorRef, subscribeToEditorState, styleResolver, refreshStyles } =
    useEditor();

  // 현재 커서 위치 문단의 style key를 반응형으로 읽는다
  const currentStyleKey = useSyncExternalStore(subscribeToEditorState, () => {
    const editor = editorRef.current;
    if (!editor?.selection) return null;
    const [match] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n.type === "paragraph",
      mode: "lowest",
    });
    return match ? (match[0] as ParagraphElement).style : null;
  });

  // styleKey로부터 theme에서 paragraph + character 속성을 해석한다
  const values: InlineParagraphStyleValues = useMemo(() => {
    if (!currentStyleKey || !styleResolver) return NULL_VALUES;
    try {
      const theme = store.getTheme();
      const composite = theme.style[currentStyleKey];
      if (!composite) return { ...NULL_VALUES, styleKey: currentStyleKey };

      const para = composite.paragraph_style
        ? theme.paragraph[composite.paragraph_style]
        : undefined;
      const char = composite.character_style
        ? theme.character[composite.character_style]
        : undefined;

      return {
        styleKey: currentStyleKey,
        lineSpacing: para?.line_spacing ?? null,
        align: para?.align ?? null,
        marginTop: para?.margin_top ?? null,
        marginBottom: para?.margin_bottom ?? null,
        mark: para?.mark,
        outdent: para?.outdent ?? null,
        fontFace: char?.face ?? null,
        fontSize: char?.size ?? null,
        bold: char?.bold ?? null,
      };
    } catch {
      return NULL_VALUES;
    }
  }, [currentStyleKey, store, styleResolver]);

  /**
   * 선택된 문단들에 대해 새 인라인 스타일을 생성하고 적용하는 공통 로직.
   * character 또는 paragraph 중 하나를 변경할 수 있다.
   */
  const applyInlineStyle = useCallback(
    (
      modifyChar?: (current: Record<string, unknown>) => void,
      modifyPara?: (current: Record<string, unknown>) => void,
    ) => {
      const editor = editorRef.current;
      if (!editor?.selection) return;

      const theme = store.getTheme();

      const paragraphEntries = Array.from(
        Editor.nodes(editor, {
          match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            n.type === "paragraph",
          mode: "lowest",
        }),
      ) as [ParagraphElement, Path][];

      // style key별로 그룹화
      const byStyleKey = new Map<string, Path[]>();
      for (const [node, path] of paragraphEntries) {
        const key = node.style ?? "";
        if (!byStyleKey.has(key)) byStyleKey.set(key, []);
        byStyleKey.get(key)!.push(path);
      }

      // notifyChange 배칭: 모든 addStyle 호출이 끝날 때까지 리스너 억제
      store.beginTransaction();
      try {
        // 정규화 배칭: 모든 setNodes 완료 후 한 번만 정규화
        Editor.withoutNormalizing(editor, () => {
          for (const [currentKey, paths] of byStyleKey) {
            const composite = theme.style[currentKey];
            if (!composite) continue;

            const charObj: Record<string, unknown> = composite.character_style
              ? { ...theme.character[composite.character_style] }
              : {};
            const paraObj: Record<string, unknown> = composite.paragraph_style
              ? { ...theme.paragraph[composite.paragraph_style] }
              : {};
            const currentBorder = composite.border_style
              ? theme.border[composite.border_style] ?? null
              : null;

            modifyChar?.(charObj);
            modifyPara?.(paraObj);

            const newStyleKey = store.addStyle(
              charObj as CharacterStyle,
              paraObj as ParagraphStyle,
              currentBorder,
            );

            for (const path of paths) {
              Transforms.setNodes(
                editor,
                { style: newStyleKey } as Partial<ParagraphElement>,
                { at: path },
              );
              // 직접 자식 run만 변경 (Editor.nodes는 조상도 순회하므로
              // 테이블 내부 paragraph에서 호출 시 외부 run까지 매칭되는 문제 방지)
              const [paraNode] = Editor.node(editor, path);
              if (SlateElement.isElement(paraNode)) {
                for (let i = 0; i < paraNode.children.length; i++) {
                  const child = paraNode.children[i];
                  if (SlateElement.isElement(child) && child.type === "run") {
                    Transforms.setNodes(
                      editor,
                      { style: newStyleKey } as Partial<RunElement>,
                      { at: [...path, i] },
                    );
                  }
                }
              }
            }
          }
        });
      } finally {
        store.commitTransaction();
      }
      // CSS 재생성은 모든 스타일 등록 완료 후 한 번만
      refreshStyles();
    },
    [store, editorRef, refreshStyles],
  );

  const setParagraphProperty = useCallback(
    (
      property: keyof ParagraphStyle,
      value: number | string | Mark | null | undefined,
    ) => {
      applyInlineStyle(undefined, (paraObj) => {
        if (value === null || value === undefined) {
          delete paraObj[property];
        } else {
          paraObj[property] = value;
        }
      });
    },
    [applyInlineStyle],
  );

  const setCharacterProperty = useCallback(
    (
      property: keyof CharacterStyle,
      value: number | string | string[] | boolean | null | undefined,
    ) => {
      applyInlineStyle((charObj) => {
        if (value === null || value === undefined) {
          delete charObj[property];
        } else {
          charObj[property] = value;
        }
      });
    },
    [applyInlineStyle],
  );

  return { values, setParagraphProperty, setCharacterProperty };
}
