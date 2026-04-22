import { Transforms, Editor, Element as SlateElement, type NodeEntry, type BaseOperation } from "slate";
import type { HwpxEditor, ParagraphElement, RunElement } from "../schema";

/**
 * 새로 생성된 paragraph(refId가 null)에 이전 sibling의 style을 상속한다.
 * refId 부여는 dispatcher의 applyActions → WASM refId 갱신 → syncRefIds에서 처리한다.
 *
 * split_node 연산 시 새 노드에 원본의 refId가 복사되는 것을 방지한다.
 * (onChange가 splitNodes 직후에 발생하여 중복 refId로 dispatchDirty가 실행되는 문제 차단)
 */
export function withRefIdNormalizer(editor: HwpxEditor): HwpxEditor {
  const { normalizeNode, apply } = editor;

  // split_node 연산에서 paragraph/run의 refId를 null로 설정하여
  // 새 노드가 원본의 refId를 복사하지 않도록 한다.
  editor.apply = (op: BaseOperation) => {
    if (op.type === 'split_node') {
      const props = op.properties as { type?: string; refId?: string | null };
      if (props.type === 'paragraph' || props.type === 'run') {
        apply({ ...op, properties: { ...props, refId: null } } as typeof op);
        return;
      }
    }
    apply(op);
  };

  editor.normalizeNode = (entry: NodeEntry) => {
    const [node, path] = entry;

    // paragraph의 자식이 bare text node인 경우 run > t 구조로 복원
    // (테이블 전체 선택 + 백스페이스 시 Slate가 빈 element에 { text: '' }를 삽입하여 구조가 깨짐)
    if (
      SlateElement.isElement(node) &&
      node.type === "paragraph"
    ) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (!SlateElement.isElement(child)) {
          Transforms.removeNodes(editor, { at: [...path, i] });
          Transforms.insertNodes(
            editor,
            {
              type: "run",
              style: null,
              refId: null,
              children: [{ type: "t", children: [{ text: (child as any).text ?? "" }] }],
            } as RunElement,
            { at: [...path, i] },
          );
          return;
        }
      }
    }

    if (
      SlateElement.isElement(node) &&
      node.type === "paragraph" &&
      !node.refId &&
      !node.style &&
      (path[path.length - 1] ?? 0) > 0
    ) {
      // 이전 sibling paragraph에서 style 상속
      const prevPath = [...path.slice(0, -1), (path[path.length - 1] ?? 0) - 1];
      try {
        const [prevNode] = Editor.node(editor, prevPath);
        if (
          SlateElement.isElement(prevNode) &&
          prevNode.type === "paragraph" &&
          prevNode.style
        ) {
          Transforms.setNodes(
            editor,
            { style: prevNode.style } as Partial<ParagraphElement>,
            { at: path },
          );
          return;
        }
      } catch {
        // path가 유효하지 않은 경우 무시
      }
    }

    normalizeNode(entry);
  };

  return editor;
}
