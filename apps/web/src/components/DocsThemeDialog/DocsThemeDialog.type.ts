import type {
  CharacterStyle,
  ParagraphStyle
} from '@docshunt/docs-editor-wasm';

export type LocalEdits = Record<
  string,
  { character: Partial<CharacterStyle>; paragraph: Partial<ParagraphStyle> }
>;
