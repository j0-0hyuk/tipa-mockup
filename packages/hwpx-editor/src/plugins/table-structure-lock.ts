import { Editor, Element as SlateElement, Path, Range, type BaseOperation } from "slate";
import type { HwpxEditor } from "../schema";

/**
 * 테이블 구조 변경(행/열 추가/삭제)을 차단하고 셀 내용 편집만 허용한다.
 * editor.apply를 오버라이드하여 table_row/table_cell/table 노드에 대한
 * insert_node, remove_node, split_node, merge_node 연산을 차단한다.
 * 또한 deleteBackward/deleteForward를 오버라이드하여 셀 경계를 넘는 삭제를 차단한다.
 */
export function withTableStructureLock(editor: HwpxEditor): HwpxEditor {
  const { apply, deleteBackward, deleteForward, deleteFragment } = editor;

  editor.apply = (op: BaseOperation) => {
    if (!(editor as any).__bypassTableLock && isTableStructureOp(editor, op)) {
      return; // 차단
    }
    apply(op);
  };

  editor.deleteBackward = (unit) => {
    if (isCursorAtCellEdge(editor, "start")) {
      return; // 셀 시작 위치에서 Backspace 차단
    }
    deleteBackward(unit);
  };

  editor.deleteForward = (unit) => {
    if (isCursorAtCellEdge(editor, "end")) {
      return; // 셀 끝 위치에서 Delete 차단
    }
    deleteForward(unit);
  };

  editor.deleteFragment = (direction) => {
    if (selectionIncludesTable(editor)) {
      return; // 테이블을 포함하는 범위 삭제 차단
    }
    deleteFragment(direction);
  };

  return editor;
}

/**
 * 커서가 테이블 셀의 시작/끝 경계에 있는지 확인한다.
 * 셀 경계에서의 Backspace/Delete가 인접 셀로 침범하는 것을 방지하기 위해 사용.
 */
function isCursorAtCellEdge(editor: HwpxEditor, edge: "start" | "end"): boolean {
  const { selection } = editor;
  if (!selection) return false;

  // 셀 내부에 있는지 확인
  const cellEntry = Editor.above(editor, {
    match: (n) => SlateElement.isElement(n) && n.type === "table_cell",
  });
  if (!cellEntry) return false;

  const [, cellPath] = cellEntry;
  const edgePoint = edge === "start"
    ? Editor.start(editor, cellPath)
    : Editor.end(editor, cellPath);

  return Editor.isEdge(editor, selection.anchor, edgePoint);
}

/**
 * 현재 선택 범위가 테이블을 포함하면서 셀 경계를 넘는지 확인한다.
 * 같은 셀 내부의 선택은 정상 삭제를 허용하고,
 * 셀 간/테이블 외부에 걸친 선택은 차단한다.
 */
function selectionIncludesTable(editor: HwpxEditor): boolean {
  const { selection } = editor;
  if (!selection || Range.isCollapsed(selection)) return false;

  const [start, end] = Range.edges(selection);

  // 같은 셀 내부의 선택이면 허용
  const startCell = Editor.above(editor, {
    at: start,
    match: (n) => SlateElement.isElement(n) && n.type === "table_cell",
  });
  const endCell = Editor.above(editor, {
    at: end,
    match: (n) => SlateElement.isElement(n) && n.type === "table_cell",
  });
  if (startCell && endCell && Path.equals(startCell[1], endCell[1])) {
    return false;
  }

  // 선택 범위 내에 테이블 노드가 하나라도 있으면 차단
  const tableIter = Editor.nodes(editor, {
    at: selection,
    match: (n) => SlateElement.isElement(n) && n.type === "table",
  });
  return !tableIter.next().done;
}

const TABLE_STRUCTURE_TYPES = new Set(["table", "table_row", "table_cell", "sub_list", "pic"]);

function isTableStructureOp(editor: HwpxEditor, op: BaseOperation): boolean {
  switch (op.type) {
    case "insert_node": {
      if (SlateElement.isElement(op.node) && TABLE_STRUCTURE_TYPES.has(op.node.type)) {
        return true;
      }
      return false;
    }
    case "remove_node": {
      if (SlateElement.isElement(op.node) && TABLE_STRUCTURE_TYPES.has(op.node.type)) {
        return true;
      }
      return false;
    }
    case "split_node": {
      // split_node의 properties에서 type을 확인
      const props = op.properties as { type?: string };
      if (props.type && TABLE_STRUCTURE_TYPES.has(props.type)) {
        return true;
      }
      return false;
    }
    case "merge_node": {
      const mergeProps = op.properties as { type?: string };
      if (mergeProps.type && TABLE_STRUCTURE_TYPES.has(mergeProps.type)) {
        return true;
      }
      return false;
    }
    default:
      return false;
  }
}
