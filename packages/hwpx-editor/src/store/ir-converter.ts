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
import type { DocumentStore } from "./document-store";

/** 바이너리 → base64 문자열 */
function uint8ToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

/** 파일 확장자 → MIME 타입 */
function mimeFromExt(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    bmp: "image/bmp",
    webp: "image/webp",
  };
  return map[ext] ?? "image/png";
}

interface ConvertContext {
  store?: DocumentStore;
}

function makeEmptyParagraph(): ParagraphElement {
  return {
    type: "paragraph",
    style: null,
    refId: null,
    children: [
      {
        type: "run",
        style: null,
        refId: null,
        children: [{ type: "t", children: [{ text: "" }] }],
      },
    ],
  };
}

/**
 * WASM toActionNodes()가 반환하는 IR XML 문자열 배열을 Slate 노드 배열로 변환한다.
 */
export function irToSlateNodes(
  xmlStrings: string[],
  store?: DocumentStore,
): ParagraphElement[] {
  const xmlStr = xmlStrings.join("");
  const wrapper = new DOMParser().parseFromString(
    `<root>${xmlStr}</root>`,
    "text/xml",
  );
  const root = wrapper.documentElement;
  const ctx: ConvertContext = { store };

  // 이미지 조회용 Document를 한 번만 파싱
  store?.loadImageDoc();
  try {
    const blocks = convertChildren(root, ctx);
    if (blocks.length === 0) {
      return [makeEmptyParagraph()];
    }
    return blocks;
  } finally {
    store?.freeImageDoc();
  }
}

function convertChildren(
  parent: Element,
  ctx: ConvertContext,
): ParagraphElement[] {
  const nodes: ParagraphElement[] = [];
  for (const child of Array.from(parent.childNodes)) {
    if (child.nodeType !== Node.ELEMENT_NODE) continue;
    const el = child as Element;
    const tag = el.tagName.toLowerCase();

    if (tag === "p") {
      nodes.push(convertParagraph(el, ctx));
    }
  }
  return nodes;
}

function convertParagraph(el: Element, ctx: ConvertContext): ParagraphElement {
  const style = el.getAttribute("style") || null;
  const refId = el.getAttribute("refId") || null;

  const runs: RunElement[] = [];

  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType !== Node.ELEMENT_NODE) continue;
    const runEl = child as Element;
    if (runEl.tagName.toLowerCase() !== "run") continue;
    runs.push(convertRun(runEl, ctx));
  }

  if (runs.length === 0) {
    runs.push({
      type: "run",
      style: null,
      refId: null,
      children: [{ type: "t", children: [{ text: "" }] }],
    });
  }

  return { type: "paragraph", style, refId, children: runs };
}

function convertRun(
  el: Element,
  ctx: ConvertContext,
): RunElement {
  const style = el.getAttribute("style") || null;
  const refId = el.getAttribute("refId") || null;

  const children: (TextBlockElement | TableElement | PicElement)[] = [];

  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType !== Node.ELEMENT_NODE) continue;
    const childEl = child as Element;
    const tag = childEl.tagName.toLowerCase();

    if (tag === "t") {
      children.push(convertT(childEl));
    } else if (tag === "tbl") {
      children.push(convertTable(childEl, ctx));
    } else if (tag === "pic") {
      children.push(convertPic(childEl, ctx));
    }
  }

  if (children.length === 0) {
    children.push({ type: "t", children: [{ text: "" }] });
  }

  return { type: "run", style, refId, children };
}

function convertT(el: Element): TextBlockElement {
  const text = el.textContent ?? "";
  return { type: "t", children: [{ text }] };
}

function convertPic(el: Element, ctx: ConvertContext): PicElement {
  const name = el.getAttribute("name") ?? "";
  const w = el.getAttribute("width") ? Number(el.getAttribute("width")) : null;
  const h = el.getAttribute("height")
    ? Number(el.getAttribute("height"))
    : null;
  const refId = el.getAttribute("refId") || null;

  let src: string = name;
  if (ctx.store && name) {
    const data = ctx.store.getImageData(name);
    if (data) {
      src = `data:${mimeFromExt(name)};base64,${uint8ToBase64(data)}`;
    }
  }

  return {
    type: "pic",
    src,
    alt: name,
    name,
    refId,
    width: w,
    height: h,
    children: [{ text: "" }],
  };
}

function convertTable(el: Element, ctx: ConvertContext): TableElement {
  const rows: TableRowElement[] = [];

  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType !== Node.ELEMENT_NODE) continue;
    const childEl = child as Element;
    if (childEl.tagName.toLowerCase() === "tr") {
      rows.push(convertTableRow(childEl, ctx));
    }
  }

  if (rows.length === 0) {
    rows.push({
      type: "table_row",
      refId: null,
      children: [
        {
          type: "table_cell",
          style: null,
          refId: null,
          rowspan: 1,
          colspan: 1,
          width: null,
          height: null,
          children: [{ type: "sub_list", refId: null, children: [makeEmptyParagraph()] }],
        },
      ],
    });
  }

  return {
    type: "table",
    style: el.getAttribute("style") || null,
    refId: el.getAttribute("refId") || null,
    width: el.getAttribute("width") ? Number(el.getAttribute("width")) : null,
    height: el.getAttribute("height")
      ? Number(el.getAttribute("height"))
      : null,
    treat_as_char: el.getAttribute("treat_as_char")
      ? Number(el.getAttribute("treat_as_char"))
      : null,
    children: rows,
  };
}

function convertTableRow(
  el: Element,
  ctx: ConvertContext,
): TableRowElement {
  const cells: TableCellElement[] = [];

  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType !== Node.ELEMENT_NODE) continue;
    const childEl = child as Element;
    if (childEl.tagName.toLowerCase() === "tc") {
      cells.push(convertTableCell(childEl, ctx));
    }
  }

  if (cells.length === 0) {
    cells.push({
      type: "table_cell",
      style: null,
      refId: null,
      rowspan: 1,
      colspan: 1,
      width: null,
      height: null,
      children: [{ type: "sub_list", refId: null, children: [makeEmptyParagraph()] }],
    });
  }

  return {
    type: "table_row",
    refId: el.getAttribute("refId") || null,
    children: cells,
  };
}

function convertSubList(el: Element, ctx: ConvertContext): SubListElement {
  const paragraphs = convertChildren(el, ctx);
  return {
    type: "sub_list",
    refId: el.getAttribute("refId") || null,
    children: paragraphs.length > 0 ? paragraphs : [makeEmptyParagraph()],
  };
}

function convertTableCell(
  el: Element,
  ctx: ConvertContext,
): TableCellElement {
  const subLists: SubListElement[] = [];

  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType !== Node.ELEMENT_NODE) continue;
    const childEl = child as Element;
    const tag = childEl.tagName.toLowerCase();

    if (tag === "sublist") {
      subLists.push(convertSubList(childEl, ctx));
    } else if (tag === "p") {
      // subList 없이 직접 p가 오는 경우 — subList로 감싸기
      subLists.push({
        type: "sub_list",
        refId: null,
        children: [convertParagraph(childEl, ctx)],
      });
    }
  }

  if (subLists.length === 0) {
    subLists.push({
      type: "sub_list",
      refId: null,
      children: [makeEmptyParagraph()],
    });
  }

  return {
    type: "table_cell",
    style: el.getAttribute("style") || null,
    refId: el.getAttribute("refId") || null,
    rowspan: el.getAttribute("rowSpan")
      ? Number(el.getAttribute("rowSpan"))
      : 1,
    colspan: el.getAttribute("colSpan")
      ? Number(el.getAttribute("colSpan"))
      : 1,
    width: el.getAttribute("width") ? Number(el.getAttribute("width")) : null,
    height: el.getAttribute("height")
      ? Number(el.getAttribute("height"))
      : null,
    children: subLists,
  };
}
