import { useCallback, useMemo } from "react";
import type {
  Theme,
  CharacterStyle,
  ParagraphStyle,
  BorderStyle,
  Style,
} from "@docshunt/docs-editor-wasm";
import { useEditor } from "../components/EditorProvider";

export interface DocumentStyleEntry {
  styleKey: string;
  character: CharacterStyle | undefined;
  paragraph: ParagraphStyle | undefined;
  border: BorderStyle | undefined;
  composite: Style;
}

export interface UseDocumentStyleReturn {
  styles: DocumentStyleEntry[];
  theme: Theme;
  updateStyle: (
    styleKey: string,
    character?: Partial<CharacterStyle>,
    paragraph?: Partial<ParagraphStyle>,
    border?: Partial<BorderStyle>,
  ) => void;
  setTheme: (theme: Theme) => void;
  resetTheme: () => void;
}

function resolveStyles(theme: Theme): DocumentStyleEntry[] {
  return Object.entries(theme.style).map(([styleKey, composite]) => ({
    styleKey,
    character: composite.character_style
      ? theme.character[composite.character_style]
      : undefined,
    paragraph: composite.paragraph_style
      ? theme.paragraph[composite.paragraph_style]
      : undefined,
    border: composite.border_style
      ? theme.border[composite.border_style]
      : undefined,
    composite,
  }));
}

export function useDocumentStyle(): UseDocumentStyleReturn {
  const { store, styleResolver, refreshStyles, reloadEditor } = useEditor();

  const theme = useMemo(() => store.getTheme(), [store, styleResolver]);
  const styles = useMemo(() => resolveStyles(theme), [theme]);

  const updateStyle = useCallback(
    (
      styleKey: string,
      character?: Partial<CharacterStyle>,
      paragraph?: Partial<ParagraphStyle>,
      border?: Partial<BorderStyle>,
    ) => {
      store.updateStyle(styleKey, character, paragraph, border);
      refreshStyles();
      reloadEditor();
    },
    [store, refreshStyles, reloadEditor],
  );

  const setTheme = useCallback(
    (newTheme: Theme) => {
      store.setTheme(newTheme);
      refreshStyles();
    },
    [store, refreshStyles],
  );

  const resetTheme = useCallback(() => {
    store.resetTheme();
    refreshStyles();
  }, [store, refreshStyles]);

  return { styles, theme, updateStyle, setTheme, resetTheme };
}
