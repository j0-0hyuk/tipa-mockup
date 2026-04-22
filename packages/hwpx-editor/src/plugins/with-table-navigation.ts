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
} from "../schema";

/**
 * 표 내에서 ArrowUp/ArrowDown 키로 같은 열의 위/아래 셀로 이동하는 onKeyDown 핸들러를 생성한다.
 * - 첫 행에서 ArrowUp: 표 앞 paragraph 끝으로 이동
 * - 마지막 행에서 ArrowDown: 표 뒤 paragraph 시작으로 이동
 * - colspan을 고려하여 visual column 기준으로 대상 셀을 결정한다.
 */
export function createTableNavigationHandler(editor: HwpxEditor) {
  return function handleTableNavigation(
    event: React.KeyboardEvent<HTMLDivElement>,
  ): void {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;

    const { selection } = editor;
    if (!selection || !Range.isCollapsed(selection)) return;

    // 현재 커서가 table_cell 안에 있는지 확인
    const cellEntry = Editor.above(editor, {
      at: selection,
      match: (n) => SlateElement.isElement(n) && n.type === "table_cell",
    });
    if (!cellEntry) return; // 표 안이 아니면 브라우저 기본 동작

    const [, cellPath] = cellEntry;

    // table_row 찾기
    const rowEntry = Editor.above(editor, {
      at: cellPath,
      match: (n) => SlateElement.isElement(n) && n.type === "table_row",
    });
    if (!rowEntry) return;
    const [, rowPath] = rowEntry;

    // table 찾기
    const tableEntry = Editor.above(editor, {
      at: rowPath,
      match: (n) => SlateElement.isElement(n) && n.type === "table",
    });
    if (!tableEntry) return;
    const [tableNode, tablePath] = tableEntry;

    const table = tableNode as TableElement;
    const rowIndex = rowPath[rowPath.length - 1]!;
    const cellIndex = cellPath[cellPath.length - 1]!;
    const direction = event.key === "ArrowUp" ? -1 : 1;
    const targetRowIndex = rowIndex + direction;

    // 현재 셀의 visual column 계산 (선행 셀의 colspan 합산)
    const currentRow = table.children[rowIndex] as TableRowElement;
    let visualCol = 0;
    for (let i = 0; i < cellIndex; i++) {
      visualCol += (currentRow.children[i] as TableCellElement).colspan;
    }

    // 표 범위 밖으로 나가는 경우
    if (targetRowIndex < 0 || targetRowIndex >= table.children.length) {
      event.preventDefault();
      exitTable(editor, tablePath, direction);
      return;
    }

    // 대상 행에서 같은 visual column의 셀 찾기
    event.preventDefault();
    const targetRow = table.children[targetRowIndex] as TableRowElement;
    const targetCellIndex = findCellAtVisualColumn(targetRow, visualCol);
    const targetCellPath = [...tablePath, targetRowIndex, targetCellIndex];

    if (direction === -1) {
      Transforms.select(editor, Editor.end(editor, targetCellPath));
    } else {
      Transforms.select(editor, Editor.start(editor, targetCellPath));
    }
  };
}

/**
 * 표를 빠져나가 이전/다음 paragraph로 커서를 이동한다.
 */
function exitTable(
  editor: HwpxEditor,
  tablePath: Path,
  direction: -1 | 1,
): void {
  // 표를 포함하는 paragraph 찾기
  const paragraphEntry = Editor.above(editor, {
    at: tablePath,
    match: (n) => SlateElement.isElement(n) && n.type === "paragraph",
  });
  if (!paragraphEntry) return;
  const [, paragraphPath] = paragraphEntry;

  if (direction === -1) {
    // 이전 paragraph로
    if (!Path.hasPrevious(paragraphPath)) return;
    const prevPath = Path.previous(paragraphPath);
    Transforms.select(editor, Editor.end(editor, prevPath));
  } else {
    // 다음 paragraph로
    const nextPath = Path.next(paragraphPath);
    try {
      Node.get(editor, nextPath);
      Transforms.select(editor, Editor.start(editor, nextPath));
    } catch {
      // 다음 paragraph가 없으면 아무것도 안 함
    }
  }
}

/**
 * 주어진 행에서 특정 visual column을 포함하는 셀의 인덱스를 반환한다.
 * colspan을 고려하여 visual column이 셀 범위 안에 있는지 확인한다.
 */
function findCellAtVisualColumn(
  row: TableRowElement,
  targetVisualCol: number,
): number {
  let accCol = 0;
  for (let i = 0; i < row.children.length; i++) {
    const cell = row.children[i] as TableCellElement;
    const nextAccCol = accCol + cell.colspan;
    if (targetVisualCol >= accCol && targetVisualCol < nextAccCol) {
      return i;
    }
    accCol = nextAccCol;
  }
  // visual column이 범위를 초과하면 마지막 셀로
  return row.children.length - 1;
}
