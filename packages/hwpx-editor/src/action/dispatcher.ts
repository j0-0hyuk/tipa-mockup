import { Transforms, Editor, Element as SlateElement, type Path } from 'slate';
import { HistoryEditor } from 'slate-history';
import type { Action } from '@docshunt/docs-editor-wasm';
import type { DocumentStore } from '../store/document-store';
import type {
  HwpxEditor,
  ParagraphElement,
  RunElement,
  TableElement
} from '../schema';
import {
  slateNodeToIrXml,
  slateNodeToIrXmlShallow
} from '../store/ir-serializer';

/**
 * Slate 노드 트리와 WASM 스토어 사이의 동기화를 담당한다.
 * paragraph를 refId로 추적하고, 변경된 paragraph만 IR XML로 직렬화하여
 * add/update/delete 액션을 생성한다.
 *
 * applyActions 후 WASM의 refId를 갱신(removeRefId → addRefId)하고,
 * 변경된 refId만 Transforms.setNodes로 Slate 노드에 매핑한다.
 */
export class ActionDispatcher {
  /** shallow XML (테이블 stub) — 변경 감지 비교용 */
  private shallowCache = new Map<string, string>();
  /** full XML — getCachedXml로 diff 표시용 */
  private fullCache = new Map<string, string>();
  /** refId 동기화 중 onChange 재진입 방지 플래그 */
  private _syncing = false;

  /** rAF 기반 배칭: 예약된 requestAnimationFrame ID */
  private _rafId: number | null = null;
  /** rAF 콜백에서 사용할 editor 참조 */
  private _pendingEditor: HwpxEditor | null = null;
  /** dispatchDirty 실행이 필요한지 여부 */
  private _dirty = false;

  constructor(private store: DocumentStore) {}

  get isSyncing(): boolean {
    return this._syncing;
  }

  getCachedXml(refId: string): string | undefined {
    return this.fullCache.get(refId);
  }

  /**
   * 전체 paragraph를 IR XML로 직렬화하여 캐시한다.
   * 문서 로드 직후 또는 dispatchDirty 후에 호출된다.
   */
  snapshot(nodes: ParagraphElement[]): void {
    this.shallowCache.clear();
    this.fullCache.clear();
    for (const node of nodes) {
      this.cacheParagraph(node);
    }
  }

  /**
   * 현재 Slate 트리를 캐시와 비교하여 변경된 부분만 WASM에 반영한다.
   * 변경이 있으면 WASM refId를 갱신하고, 변경된 refId만 Transforms로 Slate 노드에 업데이트한다.
   */
  dispatchDirty(editor: HwpxEditor, nodes: ParagraphElement[]): void {
    if (this._syncing) return;

    const actions: Action[] = [];
    const currentRefIds = new Set<string>();

    this.collectActions(nodes, actions, currentRefIds);

    for (const refId of this.shallowCache.keys()) {
      if (!currentRefIds.has(refId)) {
        actions.push({ type: 'delete', refId });
      }
    }

    if (actions.length === 0) {
      this.snapshot(nodes);
      return;
    }

    this.store.applyActions(actions);

    this.store.refreshRefIds();

    // WASM에서 DFS 순서 refId 배열을 경량 조회 (XML 직렬화 없음)
    const freshRefIds = this.store.getRefIds();

    // 변경이 필요한 {path, refId} 쌍만 경량 수집
    const iter = { idx: 0, ids: freshRefIds };
    const pending: PendingRefId[] = [];
    collectRefIdChanges(nodes, iter, [], pending);

    // 수집된 변경분만 Transforms.setNodes로 일괄 적용
    this._syncing = true;
    try {
      HistoryEditor.withoutSaving(editor, () => {
        Editor.withoutNormalizing(editor, () => {
          for (const { path, refId } of pending) {
            Transforms.setNodes(editor, { refId } as any, { at: path });
          }
        });
      });
    } finally {
      this._syncing = false;
    }

    // Transforms 적용 후 editor.children에서 스냅샷 재구축
    this.snapshot(editor.children as unknown as ParagraphElement[]);
  }

  /**
   * dispatchDirty를 requestAnimationFrame으로 지연시켜 프레임당 최대 1회만 실행한다.
   * editor.children은 rAF 콜백 시점의 최신 상태를 사용하므로 중간 변경이 누락되지 않는다.
   */
  scheduleDirty(editor: HwpxEditor): void {
    this._pendingEditor = editor;
    this._dirty = true;
    if (this._rafId === null) {
      this._rafId = requestAnimationFrame(() => {
        this._rafId = null;
        this.flushDirty();
      });
    }
  }

  /**
   * 대기 중인 sync를 즉시 실행한다.
   * serialize, diff session 시작 등 WASM 상태를 읽기 전에 호출해야 한다.
   */
  flush(): void {
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    this.flushDirty();
  }

  /**
   * 대기 중인 sync를 실행하지 않고 취소한다.
   * reloadEditor, doLoad 등 Slate 트리를 WASM IR에서 새로 구축할 때 사용한다.
   */
  cancelPending(): void {
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    this._dirty = false;
    this._pendingEditor = null;
  }

  /** 대기 중인 sync가 있는지 여부 */
  get hasPending(): boolean {
    return this._dirty;
  }

  /** 리소스 정리. 컴포넌트 언마운트 시 호출. */
  dispose(): void {
    this.cancelPending();
  }

  private flushDirty(): void {
    if (!this._dirty || !this._pendingEditor) return;
    this._dirty = false;
    const editor = this._pendingEditor;
    this.dispatchDirty(editor, editor.children as ParagraphElement[]);
  }

  private cacheParagraph(node: ParagraphElement): void {
    if (node.refId) {
      this.shallowCache.set(node.refId, slateNodeToIrXmlShallow(node));
      this.fullCache.set(node.refId, slateNodeToIrXml(node));
    }
    for (const run of node.children) {
      if (!SlateElement.isElement(run)) continue;
      for (const child of run.children) {
        if (child.type === 'table') {
          this.cacheTable(child);
        }
      }
    }
  }

  private cacheTable(table: TableElement): void {
    for (const row of table.children) {
      for (const cell of row.children) {
        for (const subList of cell.children) {
          for (const para of subList.children) {
            this.cacheParagraph(para);
          }
        }
      }
    }
  }

  /**
   * 노드 배열을 순회하며 add/update 액션을 수집한다.
   * refId가 null인 노드는 새로 추가된 paragraph로 처리한다.
   * prevRefId를 추적하여 add 시 position 기준점을 결정한다.
   */
  private collectActions(
    nodes: ParagraphElement[],
    actions: Action[],
    currentRefIds: Set<string>
  ): void {
    let prevRefId: string | null = null;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (!node) continue;
      const refId = node.refId;

      // 테이블 내부 액션 먼저 수집
      for (const run of node.children) {
        if (!SlateElement.isElement(run)) continue;
        for (const child of run.children) {
          if (child.type === 'table') {
            this.collectTableActions(child, actions, currentRefIds);
          }
        }
      }

      if (!refId) {
        // refId가 없는 노드 → 새로 추가된 paragraph
        // 연속된 null-refId 노드는 같은 add 액션의 actionNodes 배열에 병합하여
        // WASM에서 순서가 뒤집히는 것을 방지한다.
        const xml = slateNodeToIrXml(node);
        if (prevRefId) {
          const lastAction = actions[actions.length - 1];
          if (
            lastAction?.type === 'add' &&
            lastAction.position === 'after' &&
            lastAction.refId === prevRefId
          ) {
            lastAction.actionNodes.push(xml);
          } else {
            actions.push({
              type: 'add',
              refId: prevRefId,
              actionNodes: [xml],
              position: 'after'
            });
          }
        } else {
          const nextRefId = this.findNextExistingRefId(nodes, i + 1);
          if (nextRefId) {
            const lastAction = actions[actions.length - 1];
            if (
              lastAction?.type === 'add' &&
              lastAction.position === 'before' &&
              lastAction.refId === nextRefId
            ) {
              lastAction.actionNodes.push(xml);
            } else {
              actions.push({
                type: 'add',
                refId: nextRefId,
                actionNodes: [xml],
                position: 'before'
              });
            }
          }
        }
        continue;
      }

      currentRefIds.add(refId);
      const shallowXml = slateNodeToIrXmlShallow(node);
      const cachedXml = this.shallowCache.get(refId);

      if (cachedXml === undefined) {
        const xml = slateNodeToIrXml(node);
        if (prevRefId) {
          actions.push({
            type: 'add',
            refId: prevRefId,
            actionNodes: [xml],
            position: 'after'
          });
        } else {
          const nextRefId = this.findNextExistingRefId(nodes, i + 1);
          if (nextRefId) {
            actions.push({
              type: 'add',
              refId: nextRefId,
              actionNodes: [xml],
              position: 'before'
            });
          }
        }
      } else if (cachedXml !== shallowXml) {
        actions.push({
          type: 'update',
          refId,
          actionNode: slateNodeToIrXml(node)
        });
      }

      prevRefId = refId;
    }
  }

  private collectTableActions(
    table: TableElement,
    actions: Action[],
    currentRefIds: Set<string>
  ): void {
    for (const row of table.children) {
      for (const cell of row.children) {
        for (const subList of cell.children) {
          this.collectActions(subList.children, actions, currentRefIds);
        }
      }
    }
  }

  private findNextExistingRefId(
    nodes: ParagraphElement[],
    startIdx: number
  ): string | null {
    for (let i = startIdx; i < nodes.length; i++) {
      const refId = nodes[i]?.refId;
      if (refId && this.shallowCache.has(refId)) {
        return refId;
      }
    }
    return null;
  }
}

/* ── flat refId 배열 기반 변경분 수집 + Transforms 동기화 ── */

interface RefIdIter {
  idx: number;
  ids: string[];
}

function nextRefId(iter: RefIdIter): string | null {
  return iter.idx < iter.ids.length ? (iter.ids[iter.idx++] ?? null) : null;
}

type PendingRefId = { path: Path; refId: string | null };

/**
 * WASM getRefIds()가 반환한 DFS 순서 flat refId 배열을 Slate 트리와 비교하여
 * 변경된 refId만 수집한다. Transforms.setNodes 호출 없이 경량 수집만 수행.
 *
 * DFS 순서: paragraph → run → (run 내부: table → row → cell → subList → paragraph 재귀, pic)
 */
function collectRefIdChanges(
  nodes: ParagraphElement[],
  iter: RefIdIter,
  basePath: Path,
  out: PendingRefId[]
): void {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (!node) continue;
    collectParagraphChanges(node, iter, [...basePath, i], out);
  }
}

function collectParagraphChanges(
  node: ParagraphElement,
  iter: RefIdIter,
  path: Path,
  out: PendingRefId[]
): void {
  const freshRefId = nextRefId(iter);
  if (node.refId !== freshRefId) {
    out.push({ path, refId: freshRefId });
  }

  for (let ri = 0; ri < node.children.length; ri++) {
    const run = node.children[ri];
    if (!run || !SlateElement.isElement(run)) continue;
    collectRunChanges(run as RunElement, iter, [...path, ri], out);
  }
}

function collectRunChanges(
  run: RunElement,
  iter: RefIdIter,
  path: Path,
  out: PendingRefId[]
): void {
  const freshRefId = nextRefId(iter);
  if (run.refId !== freshRefId) {
    out.push({ path, refId: freshRefId });
  }

  for (let ci = 0; ci < run.children.length; ci++) {
    const child = run.children[ci];
    if (!child || !SlateElement.isElement(child)) continue;
    if (child.type === 'table') {
      collectTableChanges(child, iter, [...path, ci], out);
    }
  }
}

function collectTableChanges(
  table: TableElement,
  iter: RefIdIter,
  path: Path,
  out: PendingRefId[]
): void {
  const freshRefId = nextRefId(iter);
  if (table.refId !== freshRefId) {
    out.push({ path, refId: freshRefId });
  }

  for (let ri = 0; ri < table.children.length; ri++) {
    const row = table.children[ri];
    if (!row) continue;
    const rowPath = [...path, ri];

    const freshRowRefId = nextRefId(iter);
    if (row.refId !== freshRowRefId) {
      out.push({ path: rowPath, refId: freshRowRefId });
    }

    for (let ci = 0; ci < row.children.length; ci++) {
      const cell = row.children[ci];
      if (!cell) continue;
      const cellPath = [...rowPath, ci];

      const freshCellRefId = nextRefId(iter);
      if (cell.refId !== freshCellRefId) {
        out.push({ path: cellPath, refId: freshCellRefId });
      }

      for (let si = 0; si < cell.children.length; si++) {
        const subList = cell.children[si];
        if (!subList) continue;
        const subListPath = [...cellPath, si];

        const freshSubListRefId = nextRefId(iter);
        if (subList.refId !== freshSubListRefId) {
          out.push({ path: subListPath, refId: freshSubListRefId });
        }

        collectRefIdChanges(subList.children, iter, subListPath, out);
      }
    }
  }
}
