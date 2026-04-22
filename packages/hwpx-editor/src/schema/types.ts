import type { BaseEditor } from "slate";
import type { ReactEditor } from "slate-react";
import type { HistoryEditor } from "slate-history";

// ---- Leaf (text) ----
export interface HwpxText {
  text: string;
}

// ---- Element types ----

export interface ParagraphElement {
  type: "paragraph";
  style: string | null;
  refId: string | null;
  children: RunElement[];
}

export interface RunElement {
  type: "run";
  style: string | null;
  refId: string | null;
  children: (TextBlockElement | TableElement | PicElement)[];
}

export interface TextBlockElement {
  type: "t";
  children: HwpxText[];
}

export interface TableElement {
  type: "table";
  style: string | null;
  refId: string | null;
  width: number | null;
  height: number | null;
  treat_as_char: number | null;
  children: TableRowElement[];
}

export interface TableRowElement {
  type: "table_row";
  refId: string | null;
  children: TableCellElement[];
}

export interface SubListElement {
  type: "sub_list";
  refId: string | null;
  children: ParagraphElement[];
}

export interface TableCellElement {
  type: "table_cell";
  style: string | null;
  refId: string | null;
  rowspan: number;
  colspan: number;
  width: number | null;
  height: number | null;
  children: SubListElement[];
}

export interface PicElement {
  type: "pic";
  src: string;
  alt: string | null;
  name: string;
  refId: string | null;
  width: number | null;
  height: number | null;
  children: HwpxText[];
}

export type HwpxElement =
  | ParagraphElement
  | RunElement
  | TextBlockElement
  | TableElement
  | TableRowElement
  | TableCellElement
  | SubListElement
  | PicElement;

export type HwpxEditor = BaseEditor & ReactEditor & HistoryEditor;

declare module "slate" {
  interface CustomTypes {
    Editor: HwpxEditor;
    Element: HwpxElement;
    Text: HwpxText;
  }
}
