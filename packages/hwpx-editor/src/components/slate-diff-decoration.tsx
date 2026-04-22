/**
 * Slate 에디터용 인라인 diff 데코레이션.
 *
 * Action 배열을 받아 에디터 내에 변경 하이라이트(update=노란, delete=취소선)와
 * 위젯(새 내용 미리보기 + Accept/Dismiss 버튼)을 표시한다.
 *
 * ProseMirror diff-decoration-plugin.ts의 Slate 포팅 버전.
 */
import { useMemo, useCallback, type CSSProperties } from "react";
import type { Descendant, Path } from "slate";
import { Element as SlateElement } from "slate";
import type { Action } from "@docshunt/docs-editor-wasm";
import type { DiffEntry } from "../diff/use-diff-session";
import { irToSlateNodes } from "../store/ir-converter";
import { slateTableRowToIrXml } from "../store/ir-serializer";
import type {
  HwpxElement,
  ParagraphElement,
  TableElement,
  TableRowElement,
} from "../schema";
import { type DiffStyleTokens, defaultDiffTokens } from "../diff/diff-style-tokens";

/* ── Types ── */

export interface DiffTarget {
  /** 대상 paragraph/table의 path */
  path: Path;
  /** 대상의 refId */
  refId: string;
  /** update/add/delete */
  actionType: Action["type"];
  /** diff entry의 index (accept/reject 시 사용) */
  entryIndex: number;
  /** "add" 액션의 삽입 위치 */
  position?: "before" | "after";
  /** 테이블 내부인 경우 부모 table의 path */
  tablePath?: Path;
  /** 테이블 내부(table_row/table_cell) 또는 table 자체인 경우 true — 개별 위젯 대신 그룹 위젯 사용 */
  isTableChild?: boolean;
}

/* ── refId → path 매핑 ── */

/**
 * Slate 트리에서 refId → path 매핑을 빌드한다.
 * paragraph, table_row, table_cell, table, pic 등 모든 refId 속성을 수집.
 */
function buildRefIdMap(value: Descendant[]): Map<string, Path> {
  const map = new Map<string, Path>();

  function walk(nodes: Descendant[], parentPath: Path) {
    nodes.forEach((node, i) => {
      const path = [...parentPath, i];
      if (SlateElement.isElement(node)) {
        const el = node as HwpxElement;
        if ("refId" in el && el.refId) {
          map.set(el.refId, path);
        }
        if ("children" in el) {
          walk(el.children as Descendant[], path);
        }
      }
    });
  }

  walk(value, []);
  return map;
}

/**
 * path로 Slate 트리의 노드를 가져온다.
 */
function getNodeAtPath(value: Descendant[], path: Path): Descendant | null {
  let node: Descendant | { children: Descendant[] } = { children: value } as any;
  for (const index of path) {
    if (!SlateElement.isElement(node) || index >= node.children.length) return null;
    const child = node.children[index];
    if (!child) return null;
    node = child;
  }
  return node as Descendant;
}

/**
 * path에서 가장 가까운 table 조상을 찾는다.
 * table_row, table_cell 등이 소속된 부모 table의 path와 refId를 반환.
 */
function findTableAncestor(
  value: Descendant[],
  path: Path,
): { tablePath: Path; tableRefId: string } | null {
  for (let depth = path.length - 1; depth >= 1; depth--) {
    const ancestorPath = path.slice(0, depth);
    const ancestor = getNodeAtPath(value, ancestorPath);
    if (
      ancestor &&
      SlateElement.isElement(ancestor) &&
      (ancestor as HwpxElement).type === "table"
    ) {
      const el = ancestor as TableElement;
      if (el.refId) {
        return { tablePath: ancestorPath, tableRefId: el.refId };
      }
    }
  }
  return null;
}

/**
 * diff entries를 분석하여 refId 기반으로 대상 path를 찾는다.
 * run-level 타겟은 부모 paragraph로 버블업한다.
 */
export function useDiffTargets(
  entries: DiffEntry[],
  value: Descendant[],
): Map<string, DiffTarget[]> {
  return useMemo(() => {
    if (entries.length === 0) return new Map();
    const refIdMap = buildRefIdMap(value);
    const targets = new Map<string, DiffTarget[]>();

    entries.forEach((entry, entryIndex) => {
      const { action } = entry;
      const path = refIdMap.get(action.refId);
      if (!path) return;

      let targetRefId = action.refId;
      let targetPath = path;

      // run-level 타겟은 부모 paragraph로 버블업
      const node = getNodeAtPath(value, path);
      if (node && SlateElement.isElement(node) && (node as HwpxElement).type === "run" && path.length > 1) {
        const parentPath = path.slice(0, -1);
        const parentNode = getNodeAtPath(value, parentPath);
        if (parentNode && SlateElement.isElement(parentNode)) {
          const parentEl = parentNode as HwpxElement;
          if ("refId" in parentEl && parentEl.refId) {
            targetRefId = parentEl.refId;
            targetPath = parentPath;
          }
        }
      }

      // 테이블 내부(table_row, table_cell) 또는 table 자체인지 확인
      const targetNode = getNodeAtPath(value, targetPath);
      const targetType = targetNode && SlateElement.isElement(targetNode)
        ? (targetNode as HwpxElement).type
        : null;
      let isTableChild = false;
      let tablePath: Path | undefined;

      if (targetType === "table") {
        // table 자체를 대상으로 하는 액션
        isTableChild = true;
        tablePath = targetPath;
      } else if (targetType === "table_row" || targetType === "table_cell") {
        // table 내부 노드 → 부모 table 찾기
        const tableAncestor = findTableAncestor(value, targetPath);
        if (tableAncestor) {
          isTableChild = true;
          tablePath = tableAncestor.tablePath;
        }
      }

      const target: DiffTarget = {
        path: targetPath,
        refId: targetRefId,
        actionType: action.type,
        entryIndex,
        position: action.type === "add" ? (action as { position?: string }).position as "before" | "after" ?? "after" : undefined,
        isTableChild,
        tablePath,
      };

      // 개별 refId에 저장
      const existing = targets.get(targetRefId);
      if (existing) {
        existing.push(target);
      } else {
        targets.set(targetRefId, [target]);
      }

      // 테이블 자식인 경우 부모 table의 refId에도 저장 (그룹 위젯용)
      if (isTableChild && tablePath) {
        const tableNode = getNodeAtPath(value, tablePath);
        if (tableNode && SlateElement.isElement(tableNode)) {
          const tableEl = tableNode as TableElement;
          if (tableEl.refId && tableEl.refId !== targetRefId) {
            const tableTargets = targets.get(tableEl.refId);
            if (tableTargets) {
              tableTargets.push(target);
            } else {
              targets.set(tableEl.refId, [target]);
            }
          }
        }
      }
    });

    return targets;
  }, [entries, value]);
}

/* ── enrichActionXml ── */

/**
 * actionNode XML에 원본 스타일 속성을 주입한다.
 * ProseMirror 버전과 동일한 로직.
 */
function enrichActionXml(
  xml: string,
  paraStyle: string | null,
  runStyle: string | null,
): string {
  let t = xml.trim();

  if (t.startsWith("<run")) {
    if (runStyle && !/ style=/.test(t.split(">")[0] ?? "")) {
      t = t.replace(/^<run/, `<run style="${runStyle}"`);
    }
    const pAttr = paraStyle ? ` style="${paraStyle}"` : "";
    t = `<p${pAttr}>${t}</p>`;
  } else {
    if (t.startsWith("<p") && paraStyle) {
      const pTag = t.split(">")[0] ?? "";
      if (!/ style=/.test(pTag)) {
        t = t.replace(/^<p/, `<p style="${paraStyle}"`);
      }
    }
    if (runStyle) {
      t = t.replace(/<run(?![^>]* style=)([^>]*>)/g, `<run style="${runStyle}"$1`);
    }
  }

  return t;
}

/* ── Preview rendering (IR XML → inline HTML) ── */

/**
 * IR XML 배열을 간단한 HTML 문자열로 변환.
 * StyleResolver의 data-attribute CSS가 적용되도록 속성을 보존한다.
 */
function irXmlToHtml(irXmls: string[]): string {
  const nodes = irToSlateNodes(irXmls);
  return nodes.map(renderSlateNodeToHtml).join("");
}

function renderSlateNodeToHtml(node: ParagraphElement): string {
  const attrs: string[] = [];
  if (node.style) attrs.push(`data-style="${node.style}"`);
  if (node.refId) attrs.push(`data-ref-id="${node.refId}"`);
  const inner = node.children.map(renderRunToHtml).join("");
  return `<div ${attrs.join(" ")} style="margin:0 0 4px">${inner}</div>`;
}

function renderRunToHtml(run: { type: string; style?: string | null; children: any[] }): string {
  const attrs: string[] = [];
  if (run.style) attrs.push(`data-run-style="${run.style}"`);
  let inner = "";
  for (const child of run.children) {
    if (child.type === "t") {
      const text = child.children?.map((c: { text: string }) => c.text).join("") ?? "";
      inner += `<span>${escapeHtml(text)}</span>`;
    } else if (child.type === "table") {
      inner += renderTablePreviewHtml(child);
    } else if (child.type === "pic") {
      const w = child.width ? ` width="${child.width}"` : "";
      const h = child.height ? ` height="${child.height}"` : "";
      inner += `<img src="${escapeHtml(child.src ?? child.name)}"${w}${h} style="display:inline-block;vertical-align:middle"/>`;
    }
  }
  return `<span ${attrs.join(" ")} style="display:inline">${inner}</span>`;
}

/** HWPX 단위(1/7200 inch) → CSS px 문자열 */
function hwpxToPxStr(val: number | null | undefined): string | undefined {
  if (!val) return undefined;
  return `${Math.round((val / 7200) * 96)}px`;
}

function renderTablePreviewHtml(table: any): string {
  const tableWidth = hwpxToPxStr(table.width);
  const tblAttrs: string[] = [];
  if (table.style) tblAttrs.push(`data-style="${escapeHtml(table.style)}"`);
  if (table.refId) tblAttrs.push(`data-ref-id="${escapeHtml(table.refId)}"`);
  const tblAttrStr = tblAttrs.length > 0 ? " " + tblAttrs.join(" ") : "";

  let rows = "";
  for (const row of table.children ?? []) {
    const rowRefId = row.refId ? ` data-ref-id="${escapeHtml(row.refId)}"` : "";
    let cells = "";
    for (const cell of row.children ?? []) {
      const rs = cell.rowspan > 1 ? ` rowspan="${cell.rowspan}"` : "";
      const cs = cell.colspan > 1 ? ` colspan="${cell.colspan}"` : "";
      const cellAttrs: string[] = [];
      if (cell.style) cellAttrs.push(`data-style="${escapeHtml(cell.style)}"`);
      if (cell.refId) cellAttrs.push(`data-ref-id="${escapeHtml(cell.refId)}"`);
      const cellAttrStr = cellAttrs.length > 0 ? " " + cellAttrs.join(" ") : "";
      const cellW = hwpxToPxStr(cell.width);
      const cellH = hwpxToPxStr(cell.height);
      const styleProps = [
        cellW ? `width:${cellW}` : "",
        cellH ? `height:${cellH}` : "",
      ].filter(Boolean).join(";");
      const styleAttr = styleProps ? ` style="${styleProps}"` : "";
      let paras = "";
      for (const subList of cell.children ?? []) {
        for (const para of subList.children ?? []) {
          paras += renderSlateNodeToHtml(para);
        }
      }
      cells += `<td${rs}${cs}${cellAttrStr}${styleAttr}>${paras}</td>`;
    }
    rows += `<tr${rowRefId}>${cells}</tr>`;
  }
  const tblWidth = tableWidth ? `width:${tableWidth}` : "";
  const tblStyle = ["border-collapse:collapse", "table-layout:fixed", tblWidth].filter(Boolean).join(";");
  return `<table${tblAttrStr} style="${tblStyle}"><tbody>${rows}</tbody></table>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ── DiffWidget React component ── */

interface DiffWidgetProps {
  type: "update" | "add" | "delete";
  previewHtml: string;
  onAccept: () => void;
  onReject: () => void;
}

export function DiffWidget({ type, previewHtml, onAccept, onReject }: DiffWidgetProps) {
  const handleAccept = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onAccept();
    },
    [onAccept],
  );
  const handleReject = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onReject();
    },
    [onReject],
  );

  return (
    <div
      className={`hwpx-diff-widget hwpx-diff-widget-${type}`}
      contentEditable={false}
      style={{ userSelect: "none" }}
    >
      {previewHtml && (
        <div
          className="hwpx-diff-widget-text"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      )}
      <div className="hwpx-diff-widget-btns">
        <button
          className="hwpx-diff-btn-accept"
          onMouseDown={handleAccept}
        >
          {type === "delete" ? "삭제" : "수락"}
        </button>
        <button
          className="hwpx-diff-btn-reject"
          onMouseDown={handleReject}
        >
          무시
        </button>
      </div>
    </div>
  );
}

/* ── Paragraph-level highlight styles ── */

export function getDiffHighlightStyle(actionType: Action["type"]): CSSProperties | undefined {
  if (actionType === "update") {
    return { background: "#fef9c3" };
  }
  if (actionType === "delete") {
    return { background: "#fef2f2", textDecoration: "line-through", opacity: 0.6 };
  }
  return undefined;
}

/* ── Build preview HTML for a diff entry ── */

export function buildPreviewHtml(entry: DiffEntry, value: Descendant[]): string {
  const { action } = entry;

  if (action.type === "update") {
    const actionNode = (action as { actionNode: string }).actionNode;
    const isBlock = actionNode.trim().startsWith("<p") || actionNode.trim().startsWith("<tr");
    const paraStyle = findParaStyleByRefId(value, action.refId);
    // Block(paragraph) update: runStyle=null (runs 내부에 이미 style 있음)
    // Inline(run) update: runStyle=해당 run의 style
    const runStyle = isBlock ? null : findRunStyleByRefId(value, action.refId);
    const enriched = enrichActionXml(actionNode, paraStyle, runStyle);
    return irXmlToHtml([enriched]);
  }

  if (action.type === "add") {
    const xmls = (action as { actionNodes: string[] }).actionNodes;
    // Table row XMLs: wrap in <tbl> so irToSlateNodes can parse them
    if (xmls.length > 0 && xmls[0]?.trim().startsWith("<tr")) {
      return irXmlToHtml([`<tbl>${xmls.join("")}</tbl>`]);
    }
    const paraStyle = findParaStyleByRefId(value, action.refId);
    const enriched = xmls.map((xml) =>
      enrichActionXml(xml, paraStyle, null),
    );
    return irXmlToHtml(enriched);
  }

  return "";
}

/**
 * 테이블 그룹의 통합 프리뷰 HTML을 빌드한다.
 * 기존 행 + add/update/delete 수정사항을 합쳐 전체 수정된 테이블을 렌더링.
 * action XML의 스타일 속성을 그대로 사용한다.
 */
export function buildTableGroupPreviewHtml(
  tableEl: TableElement,
  targets: DiffTarget[],
  entries: DiffEntry[],
): string {
  const addBefore = new Map<string, string[]>();
  const addAfter = new Map<string, string[]>();
  const updates = new Map<string, string>();
  const deletes = new Set<string>();

  for (const target of targets) {
    if (!target.isTableChild) continue;
    const entry = entries[target.entryIndex];
    if (!entry) continue;
    const action = entry.action;

    if (action.type === "add") {
      const addAction = action as { refId: string; position?: string; actionNodes: string[] };
      const map = addAction.position === "before" ? addBefore : addAfter;
      const existing = map.get(action.refId) ?? [];
      existing.push(...addAction.actionNodes);
      map.set(action.refId, existing);
    } else if (action.type === "update") {
      updates.set(action.refId, (action as { actionNode: string }).actionNode);
    } else if (action.type === "delete") {
      deletes.add(action.refId);
    }
  }

  // 기존 행 + 수정사항을 합쳐 전체 테이블 XML 생성
  const rowXmls: string[] = [];
  for (const row of tableEl.children as TableRowElement[]) {
    const refId = row.refId;

    if (refId && addBefore.has(refId)) {
      rowXmls.push(...addBefore.get(refId)!);
    }

    if (refId && deletes.has(refId)) {
      // 삭제된 행은 스킵
    } else if (refId && updates.has(refId)) {
      rowXmls.push(updates.get(refId)!);
    } else {
      rowXmls.push(slateTableRowToIrXml(row));
    }

    if (refId && addAfter.has(refId)) {
      rowXmls.push(...addAfter.get(refId)!);
    }
  }

  // 모든 행이 삭제된 경우 빈 테이블 프리뷰 대신 빈 문자열 반환
  if (rowXmls.length === 0) return "";

  const tblXmlAttrs: string[] = [];
  if (tableEl.style) tblXmlAttrs.push(`style="${tableEl.style}"`);
  if (tableEl.refId) tblXmlAttrs.push(`refId="${tableEl.refId}"`);
  if (tableEl.width) tblXmlAttrs.push(`width="${tableEl.width}"`);
  if (tableEl.height) tblXmlAttrs.push(`height="${tableEl.height}"`);
  if (tableEl.treat_as_char) tblXmlAttrs.push(`treat_as_char="${tableEl.treat_as_char}"`);
  const tblAttrStr = tblXmlAttrs.length > 0 ? " " + tblXmlAttrs.join(" ") : "";
  return irXmlToHtml([`<tbl${tblAttrStr}>${rowXmls.join("")}</tbl>`]);
}

/**
 * refId로 paragraph의 style을 찾는다.
 * run refId인 경우 부모 paragraph의 style을 반환한다.
 */
function findParaStyleByRefId(
  value: Descendant[],
  refId: string,
  parentStyle?: string | null,
): string | null {
  for (const node of value) {
    if (SlateElement.isElement(node)) {
      const el = node as HwpxElement;
      if ("refId" in el && el.refId === refId) {
        // run이면 부모 paragraph의 style 반환
        if (el.type === "run") return parentStyle ?? null;
        return ("style" in el ? el.style : null) ?? null;
      }
      if ("children" in el) {
        const curStyle = el.type === "paragraph" && "style" in el ? el.style : parentStyle;
        const found = findParaStyleByRefId(el.children as Descendant[], refId, curStyle);
        if (found !== null) return found;
      }
    }
  }
  return null;
}

/**
 * refId로 run의 style을 찾는다 (run update 시 enrichActionXml에 전달).
 */
function findRunStyleByRefId(value: Descendant[], refId: string): string | null {
  for (const node of value) {
    if (SlateElement.isElement(node)) {
      const el = node as HwpxElement;
      if ("refId" in el && el.refId === refId && "style" in el) {
        return el.style ?? null;
      }
      if ("children" in el) {
        const found = findRunStyleByRefId(el.children as Descendant[], refId);
        if (found !== null) return found;
      }
    }
  }
  return null;
}

/* ── CSS injection ── */

function buildDiffCss(tokens: DiffStyleTokens): string {
  return `
.hwpx-diff-widget {
  padding: 6px 12px;
  margin: 4px 0;
  border-radius: ${tokens.radiusSm};
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
}
.hwpx-diff-widget-update {
  background: ${tokens.bgAccentSubtle};
}
.hwpx-diff-widget-add {
  background: ${tokens.bgAccentSubtle};
}
.hwpx-diff-widget-delete {
  background: transparent;
  padding: 2px 12px;
  margin: 0;
}
.hwpx-diff-widget-text {
  flex: 1;
  word-break: break-word;
}
.hwpx-diff-widget:has(table) {
  width: fit-content;
  max-width: none;
}
.hwpx-diff-widget-btns {
  display: flex;
  gap: 4px;
  align-self: flex-end;
  align-items: center;
}
.hwpx-diff-btn-accept {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 5.5px 12px;
  border: none;
  border-radius: ${tokens.radiusLg};
  background: ${tokens.bgAccent};
  color: ${tokens.bgWhite};
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  letter-spacing: -0.02em;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.hwpx-diff-btn-accept:hover { background: ${tokens.bgAccentDark}; }
.hwpx-diff-btn-reject {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 5.5px 12px;
  border: 1px solid ${tokens.lineDefault};
  border-radius: ${tokens.radiusLg};
  background: ${tokens.bgWhite};
  color: ${tokens.textPrimary};
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  letter-spacing: -0.02em;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.hwpx-diff-btn-reject:hover { background: ${tokens.bgMediumGrey}; }
[data-slate-editor] .hwpx-diff-btn-accept,
[data-slate-editor] .hwpx-diff-btn-reject {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
}
[data-diff-type="update"] > [data-run-style] {
  background: #fef9c3;
}
[data-diff-type="delete"] > [data-run-style] {
  background: #fef2f2;
  text-decoration: line-through;
  opacity: 0.6;
}
`;
}

let cssInjected = false;
export function injectDiffStyles(tokens?: DiffStyleTokens): void {
  const css = buildDiffCss(tokens ?? defaultDiffTokens);
  const existing = document.getElementById("hwpx-diff-styles");
  if (existing) {
    if (!cssInjected) existing.textContent = css;
    cssInjected = true;
    return;
  }
  const style = document.createElement("style");
  style.id = "hwpx-diff-styles";
  style.textContent = css;
  document.head.appendChild(style);
  cssInjected = true;
}
