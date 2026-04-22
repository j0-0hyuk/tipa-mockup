import type {
  CharacterStyle,
  ParagraphStyle
} from '@docshunt/docs-editor-wasm';
import type { LocalEdits } from '@/components/DocsThemeDialog/DocsThemeDialog.type';

export const getCharacterValue = (
  edits: LocalEdits,
  styleKey: string,
  original: CharacterStyle | undefined,
  field: keyof CharacterStyle
) => {
  return edits[styleKey]?.character?.[field] ?? original?.[field];
};

export const getParagraphValue = (
  edits: LocalEdits,
  styleKey: string,
  original: ParagraphStyle | undefined,
  field: keyof ParagraphStyle
) => {
  const editParagraph = edits[styleKey]?.paragraph;
  if (editParagraph && field in editParagraph) {
    return editParagraph[field];
  }
  return original?.[field];
};

export const buildPreviewStyle = (
  edits: LocalEdits,
  styleKey: string,
  character: CharacterStyle | undefined,
  paragraph: ParagraphStyle | undefined
) => {
  const size = getCharacterValue(edits, styleKey, character, 'size') as
    | number
    | undefined;
  const bold = getCharacterValue(edits, styleKey, character, 'bold') as
    | boolean
    | undefined;
  const italic = getCharacterValue(edits, styleKey, character, 'italic') as
    | boolean
    | undefined;
  const face = getCharacterValue(edits, styleKey, character, 'face') as
    | string[]
    | undefined;
  const lineSpacing = getParagraphValue(
    edits,
    styleKey,
    paragraph,
    'line_spacing'
  ) as number | undefined;
  const marginTop = getParagraphValue(
    edits,
    styleKey,
    paragraph,
    'margin_top'
  ) as number | undefined;
  const marginBottom = getParagraphValue(
    edits,
    styleKey,
    paragraph,
    'margin_bottom'
  ) as number | undefined;

  const style: React.CSSProperties = {};
  // Cap preview font size to keep it readable within the preview box
  if (size) style.fontSize = `${Math.min(size, 20)}px`;
  if (bold) style.fontWeight = 'bold';
  if (italic) style.fontStyle = 'italic';
  if (face?.length) style.fontFamily = face.join(', ');
  if (lineSpacing) style.lineHeight = `${lineSpacing}%`;
  if (marginTop) style.marginTop = `${marginTop}px`;
  if (marginBottom) style.marginBottom = `${marginBottom}px`;
  return style;
};
