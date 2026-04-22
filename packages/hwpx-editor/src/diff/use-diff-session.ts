import { useState, useCallback, useRef } from "react";
import type { Descendant } from "slate";
import { Element as SlateElement } from "slate";
import type { Action } from "@docshunt/docs-editor-wasm";
import type { DocumentStore } from "../store/document-store";
import type { ActionDispatcher } from "../action/dispatcher";
import type { HwpxElement } from "../schema";

export interface DiffEntry {
  action: Action;
  oldXml: string | null;
  newXml: string | null;
  checked: boolean;
}

export type DiffSessionStatus = "idle" | "streaming" | "ready";

export interface DiffSession {
  entries: DiffEntry[];
  status: DiffSessionStatus;
  pushAction: (action: Action) => void;
  startStreaming: () => void;
  finishStreaming: () => void;
  toggleEntry: (index: number) => void;
  toggleAll: (checked: boolean) => void;
  applyChecked: () => void;
  acceptEntry: (index: number) => void;
  rejectEntry: (index: number) => void;
  acceptEntries: (indices: number[]) => void;
  rejectEntries: (indices: number[]) => void;
  reset: () => void;
}

export interface UseDiffSessionOptions {
  store: DocumentStore;
  dispatcher?: ActionDispatcher;
  reloadEditor?: () => void;
  getEditorValue?: () => Descendant[];
  onApply?: (actions: Action[]) => void;
  onReject?: (action: Action) => void;
  onReset?: () => void;
  onFinish?: () => void;
}

/**
 * Slate 트리를 순회하여 refId → 부모 table refId 매핑을 구축한다.
 * 같은 테이블에 속하는 entry들을 그룹으로 묶기 위해 사용.
 */
function buildTableParentMap(value: Descendant[]): Map<string, string> {
  const map = new Map<string, string>();

  function walk(nodes: Descendant[], parentTableRefId: string | null): void {
    for (const node of nodes) {
      if (!SlateElement.isElement(node)) continue;
      const el = node as HwpxElement;
      const currentTableRefId =
        el.type === "table" && "refId" in el && el.refId
          ? el.refId
          : parentTableRefId;

      if (
        "refId" in el &&
        el.refId &&
        parentTableRefId &&
        el.type !== "table"
      ) {
        map.set(el.refId, parentTableRefId);
      }

      if ("children" in el) {
        walk(el.children as Descendant[], currentTableRefId);
      }
    }
  }

  walk(value, null);
  return map;
}

/**
 * 같은 refId를 가진 entry와 같은 테이블에 속하는 entry를 하나의 그룹으로 묶는다.
 * Union-Find를 사용하여 두 기준의 겹침(transitive)도 올바르게 처리한다.
 */
function computeEntryGroups(
  value: Descendant[] | undefined,
  entries: DiffEntry[],
): Map<number, number[]> {
  if (entries.length === 0) return new Map();

  // Union-Find
  const parent = entries.map((_, i) => i);
  function find(x: number): number {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]!]!;
      x = parent[x]!;
    }
    return x;
  }
  function union(a: number, b: number) {
    parent[find(a)] = find(b);
  }

  // 같은 refId → union
  const refIdToIndices = new Map<string, number[]>();
  for (let i = 0; i < entries.length; i++) {
    const refId = entries[i]?.action.refId;
    if (!refId) continue;
    const arr = refIdToIndices.get(refId);
    if (arr) {
      arr.push(i);
    } else {
      refIdToIndices.set(refId, [i]);
    }
  }
  for (const indices of refIdToIndices.values()) {
    for (let j = 1; j < indices.length; j++) {
      union(indices[0]!, indices[j]!);
    }
  }

  // 같은 테이블 → union
  if (value) {
    const tableParentMap = buildTableParentMap(value);
    const tableToIndices = new Map<string, number[]>();
    for (let i = 0; i < entries.length; i++) {
      const tableRefId = tableParentMap.get(entries[i]?.action.refId ?? "");
      if (tableRefId) {
        const arr = tableToIndices.get(tableRefId);
        if (arr) {
          arr.push(i);
        } else {
          tableToIndices.set(tableRefId, [i]);
        }
      }
    }
    for (const indices of tableToIndices.values()) {
      for (let j = 1; j < indices.length; j++) {
        union(indices[0]!, indices[j]!);
      }
    }
  }

  // 그룹 수집 (2개 이상인 그룹만)
  const groupMap = new Map<number, number[]>();
  for (let i = 0; i < entries.length; i++) {
    const root = find(i);
    const arr = groupMap.get(root);
    if (arr) {
      arr.push(i);
    } else {
      groupMap.set(root, [i]);
    }
  }

  const result = new Map<number, number[]>();
  for (const indices of groupMap.values()) {
    if (indices.length > 1) {
      for (const idx of indices) {
        result.set(idx, indices);
      }
    }
  }
  return result;
}

export function useDiffSession(options: UseDiffSessionOptions): DiffSession {
  const {
    store,
    dispatcher,
    reloadEditor,
    getEditorValue,
    onApply,
    onReject,
    onReset,
    onFinish,
  } = options;
  const [entries, setEntries] = useState<DiffEntry[]>([]);
  const [status, setStatus] = useState<DiffSessionStatus>("idle");
  const entriesRef = useRef(entries);
  const statusRef = useRef(status);

  /**
   * 세션을 마무리한다: refId 갱신 → 트랜잭션 커밋 → 에디터 리로드.
   * 내부에서 entries === 0 && status !== "streaming" 조건을 검증한다.
   */
  const handleFinish = useCallback(() => {
    if (entriesRef.current.length > 0 || statusRef.current === "streaming") {
      return;
    }
    statusRef.current = "idle";
    setStatus("idle");
    store.refreshRefIds();
    store.commitTransaction();
    reloadEditor?.();
    onFinish?.();
  }, [store, reloadEditor, onFinish]);

  /**
   * entries에서 지정 인덱스를 제거하고 ref/state를 갱신한다.
   * 모든 entry가 소진되면 handleFinish를 호출한다 (조건은 handleFinish 내부에서 검증).
   * @returns 제거 후 남은 entries 배열
   */
  const removeEntries = useCallback(
    (indicesToRemove: number[]): DiffEntry[] => {
      const current = entriesRef.current;
      const removeSet = new Set(indicesToRemove);
      const next = current.filter((_, i) => !removeSet.has(i));
      entriesRef.current = next;
      setEntries(next);
      handleFinish();
      return next;
    },
    [handleFinish],
  );

  const pushAction = useCallback(
    (action: Action) => {
      const oldXml =
        action.type === "update" || action.type === "delete"
          ? dispatcher?.getCachedXml(action.refId) ?? null
          : null;
      const newXml =
        action.type === "update"
          ? (action as { actionNode: string }).actionNode
          : action.type === "add"
            ? (action as { actionNodes: string[] }).actionNodes.join("")
            : null;

      const next = [...entriesRef.current, { action, oldXml, newXml, checked: true }];
      entriesRef.current = next;
      setEntries(next);
    },
    [dispatcher],
  );

  // 2-A: startStreaming은 entries를 초기화하고 트랜잭션을 시작한다
  // 이전 세션이 활성 상태면 onFinish 없이 조용히 정리한다
  const startStreaming = useCallback(() => {
    dispatcher?.flush();
    if (statusRef.current !== "idle") {
      const current = entriesRef.current;
      for (const entry of current) {
        onReject?.(entry.action);
      }
      if (store.isTransacting) {
        store.commitTransaction();
      }
      reloadEditor?.();
    }
    store.beginTransaction();
    entriesRef.current = [];
    setEntries([]);
    statusRef.current = "streaming";
    setStatus("streaming");
  }, [store, dispatcher, onReject, reloadEditor]);

  // 2-B: finishStreaming은 status를 "ready"로 전환 후 handleFinish 시도 (조건은 내부에서 검증)
  const finishStreaming = useCallback(() => {
    statusRef.current = "ready";
    setStatus("ready");
    handleFinish();
  }, [handleFinish]);

  const acceptEntry = useCallback(
    (index: number) => {
      const current = entriesRef.current;
      const entry = current[index];
      if (!entry) return;

      const value = getEditorValue?.();
      const groups = computeEntryGroups(value, current);
      const groupIndices = groups.get(index);
      const indicesToRemove = groupIndices ?? [index];

      const actions = indicesToRemove
        .map((i) => current[i]?.action)
        .filter(Boolean) as Action[];
      store.applyActions(actions);
      onApply?.(actions);

      const remaining = removeEntries(indicesToRemove);
      // handleFinish가 호출되지 않은 경우(entries가 남아있을 때)만 reloadEditor
      if (remaining.length > 0) {
        reloadEditor?.();
      }
    },
    [store, onApply, reloadEditor, getEditorValue, removeEntries],
  );

  const rejectEntry = useCallback(
    (index: number) => {
      const current = entriesRef.current;
      const entry = current[index];
      if (!entry) return;

      const value = getEditorValue?.();
      const groups = computeEntryGroups(value, current);
      const groupIndices = groups.get(index);
      const indicesToRemove = groupIndices ?? [index];

      for (const idx of indicesToRemove) {
        if (current[idx]) onReject?.(current[idx].action);
      }

      removeEntries(indicesToRemove);
    },
    [onReject, getEditorValue, removeEntries],
  );

  const acceptEntries = useCallback(
    (indices: number[]) => {
      if (indices.length === 0) return;
      const current = entriesRef.current;
      const actions = indices
        .map((i) => current[i]?.action)
        .filter(Boolean) as Action[];
      if (actions.length === 0) return;
      store.applyActions(actions);
      onApply?.(actions);

      const remaining = removeEntries(indices);
      if (remaining.length > 0) {
        reloadEditor?.();
      }
    },
    [store, onApply, reloadEditor, removeEntries],
  );

  const rejectEntries = useCallback(
    (indices: number[]) => {
      if (indices.length === 0) return;
      const current = entriesRef.current;
      for (const idx of indices) {
        if (current[idx]) onReject?.(current[idx].action);
      }
      removeEntries(indices);
    },
    [onReject, removeEntries],
  );

  // 2-F: applyChecked 후 idle + handleFinish
  const applyChecked = useCallback(() => {
    const current = entriesRef.current;
    const checkedIndices: number[] = [];
    for (let i = 0; i < current.length; i++) {
      if (current[i]?.checked) checkedIndices.push(i);
    }
    if (checkedIndices.length === 0) return;
    const actions = checkedIndices
      .map((i) => current[i]!.action);
    store.applyActions(actions);
    onApply?.(actions);

    const remaining = removeEntries(checkedIndices);
    if (remaining.length > 0) {
      reloadEditor?.();
    }
  }, [store, onApply, reloadEditor, removeEntries]);

  const toggleEntry = useCallback((index: number) => {
    const value = getEditorValue?.();
    setEntries((prev) => {
      const groups = computeEntryGroups(value, prev);
      const groupIndices = groups.get(index);
      let next: DiffEntry[];
      if (groupIndices) {
        const newChecked = !prev[index]?.checked;
        next = prev.map((e, i) =>
          groupIndices.includes(i) ? { ...e, checked: newChecked } : e,
        );
      } else {
        next = prev.map((e, i) =>
          i === index ? { ...e, checked: !e.checked } : e,
        );
      }
      entriesRef.current = next;
      return next;
    });
  }, [getEditorValue]);

  const toggleAll = useCallback((checked: boolean) => {
    setEntries((prev) => {
      const next = prev.map((e) => ({ ...e, checked }));
      entriesRef.current = next;
      return next;
    });
  }, []);

  // 2-D: reset은 각 entry에 onReject 호출 + 트랜잭션 해제 + onFinish 호출
  const reset = useCallback(() => {
    const current = entriesRef.current;
    for (const entry of current) {
      onReject?.(entry.action);
    }
    entriesRef.current = [];
    setEntries([]);
    statusRef.current = "idle";
    setStatus("idle");
    onReset?.();
    // 트랜잭션 해제 (변경 없이 종료)
    if (store.isTransacting) {
      store.commitTransaction();
    }
    reloadEditor?.();
    onFinish?.();
  }, [store, onReject, onReset, reloadEditor, onFinish]);

  return {
    entries,
    status,
    pushAction,
    startStreaming,
    finishStreaming,
    toggleEntry,
    toggleAll,
    applyChecked,
    acceptEntry,
    rejectEntry,
    acceptEntries,
    rejectEntries,
    reset,
  };
}
