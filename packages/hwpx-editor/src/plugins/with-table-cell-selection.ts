import {
  Editor,
  Transforms,
  Element as SlateElement,
  Path,
  Node,
  Range,
} from "slate";
import type {
  HwpxEditor,
  TableElement,
  TableRowElement,
  TableCellElement,
  SubListElement,
  ParagraphElement,
  RunElement,
} from "../schema";

/**
 * 테이블 셀 선택 상태에서 Backspace/Delete 키를 가로채어
 * 셀 병합/손상 대신 선택된 셀의 내용만 비운다.
 * 다른 키 입력 시 셀 선택을 해제한다.
 */
export function createTableCellSelectionHandler(
  editor: HwpxEditor,
  getCellSelection: () => Path[],
  clearCellSelection: () => void,
) {
  return function handleTableCellSelection(
    event: React.KeyboardEvent<HTMLDivElement>,
  ): void {
    const cellSelection = getCellSelection();

    // 마우스 드래그로 셀이 선택된 상태
    if (cellSelection.length > 0) {
      if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
        clearAndResetCells(editor, cellSelection);
        Transforms.select(editor, Editor.start(editor, cellSelection[0]!));
        clearCellSelection();
        return;
      }
      // Escape 또는 다른 키: 셀 선택 해제
      clearCellSelection();
      if (event.key === "Escape") {
        event.preventDefault();
      }
      return;
    }

    // Fallback: Slate 텍스트 선택이 셀 간에 걸쳐 있는 경우
    if (event.key !== "Backspace" && event.key !== "Delete") return;

    const crossCellPaths = getCrossCellPaths(editor);
    if (!crossCellPaths) return;

    event.preventDefault();
    clearAndResetCells(editor, crossCellPaths);
    Transforms.select(editor, Editor.start(editor, crossCellPaths[0]!));
  };
}

/**
 * 주어진 셀들의 내용을 모두 비운다.
 */
function clearAndResetCells(editor: HwpxEditor, cellPaths: Path[]): void {
  (editor as any).__bypassTableLock = true;
  try {
    Editor.withoutNormalizing(editor, () => {
      for (let i = cellPaths.length - 1; i >= 0; i--) {
        clearCellContents(editor, cellPaths[i]!);
      }
    });
  } finally {
    (editor as any).__bypassTableLock = false;
  }
}

/**
 * 현재 Slate 선택이 같은 테이블 내 서로 다른 셀에 걸쳐 있으면
 * 해당 범위의 모든 셀 Path를 반환한다.
 */
function getCrossCellPaths(editor: HwpxEditor): Path[] | null {
  const { selection } = editor;
  if (!selection || Range.isCollapsed(selection)) return null;

  const [start, end] = Range.edges(selection);

  const startCellEntry = Editor.above(editor, {
    at: start,
    match: (n) => SlateElement.isElement(n) && n.type === "table_cell",
  });
  const endCellEntry = Editor.above(editor, {
    at: end,
    match: (n) => SlateElement.isElement(n) && n.type === "table_cell",
  });

  if (!startCellEntry || !endCellEntry) return null;
  if (Path.equals(startCellEntry[1], endCellEntry[1])) return null;

  const startTable = Editor.above(editor, {
    at: startCellEntry[1],
    match: (n) => SlateElement.isElement(n) && n.type === "table",
  });
  const endTable = Editor.above(editor, {
    at: endCellEntry[1],
    match: (n) => SlateElement.isElement(n) && n.type === "table",
  });
  if (!startTable || !endTable || !Path.equals(startTable[1], endTable[1])) return null;

  return collectCellPathsBetween(editor, startTable[1], startCellEntry[1], endCellEntry[1]);
}

/**
 * 테이블의 visual grid를 구축하여 두 셀이 이루는 사각형 영역의 모든 셀 Path를 수집한다.
 * rowspan/colspan을 고려하여 병합된 셀이 부분적으로 포함되면 영역을 자동 확장한다.
 */
export function collectCellPathsBetween(
  editor: HwpxEditor,
  tablePath: Path,
  cellPathA: Path,
  cellPathB: Path,
): Path[] {
  const tableNode = Node.get(editor, tablePath) as TableElement;
  const totalRows = tableNode.children.length;

  // ── 1. Visual grid 구축 ──
  // grid[row][col] = cellKey, positions: cellKey → visual 정보
  type CellPos = {
    visualRow: number;
    visualCol: number;
    rowspan: number;
    colspan: number;
    path: Path;
  };
  const grid: (string | undefined)[][] = Array.from({ length: totalRows }, () => []);
  const positions = new Map<string, CellPos>();

  for (let rowIdx = 0; rowIdx < totalRows; rowIdx++) {
    const row = tableNode.children[rowIdx] as TableRowElement;
    let visualCol = 0;

    for (let cellIdx = 0; cellIdx < row.children.length; cellIdx++) {
      const cell = row.children[cellIdx] as TableCellElement;
      const cellPath = [...tablePath, rowIdx, cellIdx];
      const key = cellPath.join(",");

      // 이전 rowspan이 차지하는 열 건너뛰기
      while (grid[rowIdx]![visualCol] !== undefined) {
        visualCol++;
      }

      // grid에 span 영역 채우기
      for (let dr = 0; dr < cell.rowspan; dr++) {
        for (let dc = 0; dc < cell.colspan; dc++) {
          const r = rowIdx + dr;
          const c = visualCol + dc;
          if (r < totalRows) {
            while (grid[r]!.length <= c) grid[r]!.push(undefined);
            grid[r]![c] = key;
          }
        }
      }

      positions.set(key, {
        visualRow: rowIdx,
        visualCol,
        rowspan: cell.rowspan,
        colspan: cell.colspan,
        path: cellPath,
      });

      visualCol += cell.colspan;
    }
  }

  // ── 2. 두 셀의 visual bounds로 초기 사각형 결정 ──
  const keyA = cellPathA.join(",");
  const keyB = cellPathB.join(",");
  const posA = positions.get(keyA);
  const posB = positions.get(keyB);
  if (!posA || !posB) return [];

  let minRow = Math.min(posA.visualRow, posB.visualRow);
  let maxRow = Math.max(
    posA.visualRow + posA.rowspan - 1,
    posB.visualRow + posB.rowspan - 1,
  );
  let minCol = Math.min(posA.visualCol, posB.visualCol);
  let maxCol = Math.max(
    posA.visualCol + posA.colspan - 1,
    posB.visualCol + posB.colspan - 1,
  );

  // ── 3. 부분 포함된 병합 셀에 의한 확장 (수렴할 때까지 반복) ──
  let changed = true;
  while (changed) {
    changed = false;
    const seen = new Set<string>();

    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const cellKey = grid[r]?.[c];
        if (!cellKey || seen.has(cellKey)) continue;
        seen.add(cellKey);

        const pos = positions.get(cellKey)!;
        const cellMaxRow = pos.visualRow + pos.rowspan - 1;
        const cellMaxCol = pos.visualCol + pos.colspan - 1;

        if (pos.visualRow < minRow) { minRow = pos.visualRow; changed = true; }
        if (cellMaxRow > maxRow) { maxRow = cellMaxRow; changed = true; }
        if (pos.visualCol < minCol) { minCol = pos.visualCol; changed = true; }
        if (cellMaxCol > maxCol) { maxCol = cellMaxCol; changed = true; }
      }
    }
  }

  // ── 4. 최종 사각형 내 고유 셀 Path 수집 (문서 순서) ──
  const unique = new Map<string, Path>();
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      const cellKey = grid[r]?.[c];
      if (cellKey && !unique.has(cellKey)) {
        unique.set(cellKey, positions.get(cellKey)!.path);
      }
    }
  }

  return Array.from(unique.values());
}

/**
 * 셀 내용을 비운다: 빈 subList → paragraph → run → t → text("") 로 초기화.
 * 셀의 구조적 속성(refId, style, rowspan, colspan, width, height)은 유지한다.
 *
 * 호출 전 __bypassTableLock = true 설정 필수.
 */
function clearCellContents(editor: HwpxEditor, cellPath: Path): void {
  const cellNode = Node.get(editor, cellPath) as TableCellElement;

  // 추가 sub_list 제거 (첫 번째만 유지, 역순)
  for (let si = cellNode.children.length - 1; si > 0; si--) {
    Transforms.removeNodes(editor, { at: [...cellPath, si] });
  }

  // 첫 번째 sub_list 처리
  const subListPath = [...cellPath, 0];
  const subList = Node.get(editor, subListPath) as SubListElement;

  // 추가 paragraph 제거 (첫 번째만 유지, 역순)
  for (let pi = subList.children.length - 1; pi > 0; pi--) {
    Transforms.removeNodes(editor, { at: [...subListPath, pi] });
  }

  // 첫 번째 paragraph 처리
  const paraPath = [...subListPath, 0];
  const para = Node.get(editor, paraPath) as ParagraphElement;

  // 추가 run 제거 (첫 번째만 유지, 역순)
  for (let ri = para.children.length - 1; ri > 0; ri--) {
    Transforms.removeNodes(editor, { at: [...paraPath, ri] });
  }

  // 첫 번째 run의 children을 빈 텍스트 블록으로 교체
  const runPath = [...paraPath, 0];
  const run = Node.get(editor, runPath) as RunElement;

  // 기존 children 모두 제거 (역순)
  for (let ci = run.children.length - 1; ci >= 0; ci--) {
    Transforms.removeNodes(editor, { at: [...runPath, ci] });
  }

  // 빈 텍스트 블록 삽입
  Transforms.insertNodes(
    editor,
    { type: "t", children: [{ text: "" }] },
    { at: [...runPath, 0] },
  );
}
