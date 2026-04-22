import type {
  ParagraphElement,
  RunElement,
  TextBlockElement,
  TableElement,
  TableRowElement,
  TableCellElement,
  SubListElement,
  PicElement,
} from "../schema";

/**
 * Slate ParagraphElement → IR XML 직렬화.
 * ir-converter.ts의 역변환으로, WASM Action의 actionNode 문자열을 생성한다.
 */
export function slateNodeToIrXml(node: ParagraphElement): string {
  return serializeParagraph(node);
}

/**
 * Slate TableRowElement → IR XML (<tr>...</tr>) 직렬화.
 * 테이블 그룹 diff 프리뷰에서 기존 행을 직렬화할 때 사용.
 */
export function slateTableRowToIrXml(node: TableRowElement): string {
  return serializeTableRow(node);
}

/**
 * 테이블 내용을 stub으로 대체한 shallow IR XML.
 * 캐시 비교 전용 — 셀 내부 변경이 외부 paragraph 비교에 영향을 주지 않도록 한다.
 */
export function slateNodeToIrXmlShallow(node: ParagraphElement): string {
  return serializeParagraphShallow(node);
}

function serializeParagraphShallow(node: ParagraphElement): string {
  const attrs = serializeAttrs({ style: node.style, refId: node.refId });
  let inner = "";
  for (const run of node.children) {
    if (!("type" in run)) continue;
    inner += serializeRunShallow(run);
  }
  return `<p${attrs}>${inner}</p>`;
}

function serializeRunShallow(node: RunElement): string {
  const attrs = serializeAttrs({ style: node.style, refId: node.refId });
  let inner = "";
  for (const child of node.children) {
    switch (child.type) {
      case "t":
        inner += serializeT(child);
        break;
      case "table":
        inner += serializeTableStub(child);
        break;
      case "pic":
        inner += serializePic(child);
        break;
    }
  }
  return `<run${attrs}>${inner}</run>`;
}

function serializeTableStub(node: TableElement): string {
  // shallow 캐시 비교 전용: WASM이 재계산하는 width/height를 제외하여
  // 셀 내부 변경이 상위 paragraph UPDATE를 트리거하지 않도록 한다.
  const attrs = serializeAttrs({
    refId: node.refId,
  });
  return `<tbl${attrs}/>`;
}

function serializeParagraph(node: ParagraphElement): string {
  const attrs = serializeAttrs({ style: node.style, refId: node.refId });
  let inner = "";
  for (const run of node.children) {
    if (!("type" in run)) continue;
    inner += serializeRun(run);
  }
  return `<p${attrs}>${inner}</p>`;
}

function serializeRun(node: RunElement): string {
  const attrs = serializeAttrs({ style: node.style, refId: node.refId });
  let inner = "";
  for (const child of node.children) {
    switch (child.type) {
      case "t":
        inner += serializeT(child);
        break;
      case "table":
        inner += serializeTable(child);
        break;
      case "pic":
        inner += serializePic(child);
        break;
    }
  }
  return `<run${attrs}>${inner}</run>`;
}

function serializeT(node: TextBlockElement): string {
  const text = node.children.map((c) => c.text).join("");
  return `<t>${escapeXml(text)}</t>`;
}

function serializePic(node: PicElement): string {
  const attrs = serializeAttrs({
    name: node.name,
    width: node.width,
    height: node.height,
    refId: node.refId,
  });
  return `<pic${attrs}/>`;
}

function serializeTable(node: TableElement): string {
  const attrs = serializeAttrs({
    style: node.style,
    refId: node.refId,
    width: node.width,
    height: node.height,
    treat_as_char: node.treat_as_char,
  });
  let rows = "";
  for (const row of node.children) {
    rows += serializeTableRow(row);
  }
  return `<tbl${attrs}>${rows}</tbl>`;
}

function serializeTableRow(node: TableRowElement): string {
  const attrs = serializeAttrs({ refId: node.refId });
  let cells = "";
  for (const cell of node.children) {
    cells += serializeTableCell(cell);
  }
  return `<tr${attrs}>${cells}</tr>`;
}

function serializeSubList(node: SubListElement): string {
  let blocks = "";
  for (const para of node.children) {
    blocks += serializeParagraph(para);
  }
  const attrs = serializeAttrs({ refId: node.refId });
  return `<subList${attrs}>${blocks}</subList>`;
}

function serializeTableCell(node: TableCellElement): string {
  const attrs = serializeAttrs({
    style: node.style,
    refId: node.refId,
    rowSpan: node.rowspan,
    colSpan: node.colspan,
    width: node.width,
    height: node.height,
  });
  let inner = "";
  for (const subList of node.children) {
    inner += serializeSubList(subList);
  }
  return `<tc${attrs}>${inner}</tc>`;
}

function serializeAttrs(
  attrs: Record<string, string | number | null | undefined>,
): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(attrs)) {
    if (value != null) {
      parts.push(`${key}="${escapeXml(String(value))}"`);
    }
  }
  return parts.length > 0 ? " " + parts.join(" ") : "";
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
