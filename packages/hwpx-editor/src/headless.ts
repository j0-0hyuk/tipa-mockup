// Headless entry — no @bichon/ds, no @emotion dependency
export * from "./schema";
export * from "./action";
export * from "./store";
export * from "./style";
export { computeDiff, extractTextFromIrXml, type DiffSegment } from "./diff/compute-diff";
export {
  useDiffSession,
  type DiffEntry,
  type DiffSession,
  type DiffSessionStatus,
  type UseDiffSessionOptions,
} from "./diff/use-diff-session";
export { type DiffStyleTokens, defaultDiffTokens } from "./diff/diff-style-tokens";
export { EditorProvider, useEditor, type EditorProviderProps } from "./components/EditorProvider";
export { useToolbarActions, type ToolbarActions } from "./toolbar/use-toolbar-actions";
export {
  useDocumentStyle,
  type DocumentStyleEntry,
  type UseDocumentStyleReturn,
} from "./toolbar/use-document-style";
export {
  useParagraphStyle,
  type ParagraphStyleOption,
  type UseParagraphStyleReturn,
} from "./toolbar/use-paragraph-style";
export {
  useInlineParagraphStyle,
  type InlineParagraphStyleValues,
  type UseInlineParagraphStyleReturn,
} from "./toolbar/use-inline-paragraph-style";
export { withRefIdNormalizer } from "./plugins/refid-normalizer";
export { withTableStructureLock } from "./plugins/table-structure-lock";
export { createTableCellSelectionHandler, collectCellPathsBetween } from "./plugins/with-table-cell-selection";
export {
  useDiffTargets,
  getDiffHighlightStyle,
  buildPreviewHtml,
  DiffWidget,
  injectDiffStyles,
  type DiffTarget,
} from "./components/slate-diff-decoration";
