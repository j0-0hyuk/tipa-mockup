import { useCallback, useMemo, useSyncExternalStore, type CSSProperties } from "react";
import { Transforms, Editor, Element as SlateElement } from "slate";
import type {
  CharacterStyle,
  ParagraphStyle,
  Mark,
} from "@docshunt/docs-editor-wasm";
import { useEditor } from "../components/EditorProvider";
import type { ParagraphElement, RunElement } from "../schema";

export interface ParagraphStyleOption {
  /** Style key (e.g. "l1", "l2") */
  styleKey: string;
  /** Human-readable display name (e.g. "대제목", "소제목") */
  displayName: string;
  /** List marker character (e.g. "○", "-") */
  mark: Mark | undefined;
  /** Resolved character style definition */
  character: CharacterStyle | undefined;
  /** Resolved paragraph style definition */
  paragraph: ParagraphStyle | undefined;
  /** CSS style properties derived from character style for rendering preview */
  cssStyle: CSSProperties;
}

export interface UseParagraphStyleReturn {
  /** Style key of the paragraph at the current cursor position (null if no selection or mixed) */
  currentStyleKey: string | null;
  /** Available paragraph styles from the document theme */
  options: ParagraphStyleOption[];
  /** Change the paragraph style of all paragraphs in the current selection */
  setStyle: (styleKey: string) => void;
}

function deriveCssStyle(character: CharacterStyle | undefined): CSSProperties {
  const style: CSSProperties = {};
  if (!character) return style;
  if (character.size) {
    style.fontSize = `${Math.min(character.size, 20)}px`;
  }
  if (character.bold) style.fontWeight = "bold";
  if (character.italic) style.fontStyle = "italic";
  if (character.underline) style.textDecoration = "underline";
  if (character.strike)
    style.textDecoration = style.textDecoration
      ? `${style.textDecoration} line-through`
      : "line-through";
  if (character.color) style.color = character.color;
  if (character.face?.length) style.fontFamily = character.face.join(", ");
  return style;
}

const STYLE_DISPLAY_NAMES: Record<string, string> = {
  l1: "대제목",
  l2: "소제목",
  l3: "본문",
  l4: "캡션",
};

const EMPTY_OPTIONS: ParagraphStyleOption[] = [];

export function useParagraphStyle(): UseParagraphStyleReturn {
  const { store, editorRef, subscribeToEditorState, styleResolver } =
    useEditor();

  const currentStyleKey = useSyncExternalStore(subscribeToEditorState, () => {
    const editor = editorRef.current;
    if (!editor?.selection) return null;
    const [match] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n.type === "paragraph",
      mode: "lowest",
    });
    return match ? (match[0] as ParagraphElement).style : null;
  });

  const options: ParagraphStyleOption[] = useMemo(() => {
    if (!styleResolver) return EMPTY_OPTIONS;
    try {
      const theme = store.getTheme();
      return Object.entries(theme.style)
        .filter(
          ([styleKey, s]) =>
            (s.character_style || s.paragraph_style) &&
            /^l\d+$/.test(styleKey),
        )
        .sort(([a], [b]) => {
          const numA = parseInt(a.slice(1), 10);
          const numB = parseInt(b.slice(1), 10);
          return numA - numB;
        })
        .map(([styleKey, composite]) => {
          const character = composite.character_style
            ? theme.character[composite.character_style]
            : undefined;
          const paragraph = composite.paragraph_style
            ? theme.paragraph[composite.paragraph_style]
            : undefined;
          return {
            styleKey,
            displayName: STYLE_DISPLAY_NAMES[styleKey] ?? styleKey,
            mark: paragraph?.mark,
            character,
            paragraph,
            cssStyle: deriveCssStyle(character),
          };
        });
    } catch {
      return EMPTY_OPTIONS;
    }
  }, [store, styleResolver]);

  const setStyle = useCallback(
    (styleKey: string) => {
      const editor = editorRef.current;
      if (!editor) return;

      // paragraph style 변경
      Transforms.setNodes(
        editor,
        { style: styleKey } as Partial<ParagraphElement>,
        {
          match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            n.type === "paragraph",
          mode: "lowest",
        },
      );

      // 하위 run 요소의 style도 함께 변경 (paragraph/run 스타일 동기화)
      Transforms.setNodes(
        editor,
        { style: styleKey } as Partial<RunElement>,
        {
          match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            n.type === "run",
        },
      );
    },
    [editorRef],
  );

  return { currentStyleKey, options, setStyle };
}
