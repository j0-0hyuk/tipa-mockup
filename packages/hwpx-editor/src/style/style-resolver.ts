import type { CSSProperties } from "react";
import type {
  Theme,
  CharacterStyle,
  ParagraphStyle,
  BorderStyle,
  Border,
  Style,
} from "@docshunt/docs-editor-wasm";

// docs-editor-wasm 타입을 re-export
export type { Theme, CharacterStyle, ParagraphStyle, BorderStyle, Style };

/** BorderSide → CSS border shorthand */
function borderToCss(border: Border | undefined): string {
  if (!border || !border.type || border.type === "NONE") return "none";
  const style = border.type === "DOUBLE" ? "double" : border.type.toLowerCase();
  return `${border.width ?? 0}mm ${style}`;
}

/** HWPX Theme의 스타일 시스템을 CSS로 변환하는 리졸버. */
export class StyleResolver {
  private theme: Theme;

  constructor(theme: Theme) {
    this.theme = theme;
  }

  getCompositeStyle(styleId: string): Style | undefined {
    return this.theme.style[styleId];
  }

  getCharacterDef(charStyleId: string): CharacterStyle | undefined {
    return this.theme.character[charStyleId];
  }

  getParagraphDef(paraStyleId: string): ParagraphStyle | undefined {
    return this.theme.paragraph[paraStyleId];
  }

  getBorderDef(borderStyleId: string): BorderStyle | undefined {
    return this.theme.border[borderStyleId];
  }

  getParagraphStyle(styleId: string | null): CSSProperties {
    if (!styleId) return {};
    const composite = this.getCompositeStyle(styleId);
    if (!composite?.paragraph_style) return {};
    const para = this.getParagraphDef(composite.paragraph_style);
    if (!para) return {};

    return {
      textAlign: para.align,
      lineHeight: para.line_spacing ? `${para.line_spacing}%` : undefined,
      marginTop: para.margin_top ? `${para.margin_top}pt` : undefined,
      marginBottom: para.margin_bottom ? `${para.margin_bottom}pt` : undefined,
      textIndent: para.outdent ? `-${para.outdent}mm` : undefined,
      paddingLeft: para.outdent ? `${para.outdent}mm` : undefined,
    };
  }

  getRunStyle(styleId: string | null): CSSProperties {
    if (!styleId) return {};
    const composite = this.getCompositeStyle(styleId);
    if (!composite?.character_style) return {};
    const char = this.getCharacterDef(composite.character_style);
    if (!char) return {};

    return {
      fontFamily: char.face?.length ? char.face.map((f) => `'${f}'`).join(", ") : undefined,
      fontSize: char.size ? `${char.size}pt` : undefined,
      fontWeight: char.bold ? "bold" : undefined,
      fontStyle: char.italic ? "italic" : undefined,
      color: char.color,
      textDecoration:
        [char.underline ? "underline" : "", char.strike ? "line-through" : ""]
          .filter(Boolean)
          .join(" ") || undefined,
    };
  }

  getCellBorderStyle(styleId: string | null): CSSProperties {
    if (!styleId) return {};
    const composite = this.getCompositeStyle(styleId);
    if (!composite?.border_style) return {};
    const border = this.getBorderDef(composite.border_style);
    if (!border) return {};

    return {
      borderTop: borderToCss(border.top),
      borderBottom: borderToCss(border.bottom),
      borderLeft: borderToCss(border.left),
      borderRight: borderToCss(border.right),
    };
  }

  getFullStyle(styleId: string | null): CSSProperties {
    if (!styleId) return {};
    return {
      ...this.getParagraphStyle(styleId),
      ...this.getRunStyle(styleId),
    };
  }

  /**
   * 전체 theme을 순회하여 CSS 규칙 문자열을 생성한다.
   * Rust to_html과 동일한 기본값 + 오버라이드 패턴 적용.
   *
   * data attribute 기반 selector:
   *   [data-style="s4"] { ... }      ← paragraph / table_cell (paragraph + character + border 병합)
   *   [data-run-style="s5"] { ... }   ← run_style mark (span)
   */
  toCssText(): string {
    const rules: string[] = [];

    for (const [styleId, composite] of Object.entries(this.theme.style)) {
      // ─── [data-style] : paragraph + character + border 속성 병합 ───
      {
        // Rust to_html 기본값 (p/html.rs 참조)
        const decls: string[] = [
          "margin-top: 0",
          "margin-bottom: 0",
          "line-height: normal",
          "text-indent: 0",
          "padding-left: 0",
          "font-weight: normal",
          "font-style: normal",
          "color: inherit",
          "text-align: left",
        ];
        const set = (key: string, value: string) => {
          const idx = decls.findIndex((d) => d.startsWith(`${key}:`));
          if (idx >= 0) decls[idx] = `${key}: ${value}`;
          else decls.push(`${key}: ${value}`);
        };

        // paragraph 스타일
        if (composite.paragraph_style) {
          const para = this.getParagraphDef(composite.paragraph_style);
          if (para) {
            if (para.margin_top) set("margin-top", `${para.margin_top}pt`);
            if (para.margin_bottom) set("margin-bottom", `${para.margin_bottom}pt`);
            if (para.line_spacing) set("line-height", `${para.line_spacing}%`);
            if (para.outdent) {
              set("text-indent", `-${para.outdent}mm`);
              set("padding-left", `${para.outdent}mm`);
            }
            if (para.align) set("text-align", para.align);
          }
        }

        // character 스타일 — paragraph 레벨에도 적용 (Rust p/html.rs 참조)
        if (composite.character_style) {
          const char = this.getCharacterDef(composite.character_style);
          if (char) {
            if (char.size) set("font-size", `${char.size}pt`);
            if (char.face?.length) set("font-family", char.face.map((f) => `'${f}'`).join(", "));
            if (char.bold) set("font-weight", "bold");
            if (char.italic) set("font-style", "italic");
            if (char.color) set("color", char.color);
          }
        }

        // border 스타일 — 기본 none + 실제 값 오버라이드 (Rust tc/html.rs 참조)
        if (composite.border_style) {
          const border = this.getBorderDef(composite.border_style);
          if (border) {
            set("border-left", "none");
            set("border-right", "none");
            set("border-top", "none");
            set("border-bottom", "none");
            const applySide = (side: Border | undefined, prop: string) => {
              if (side?.type && side.type !== "NONE") {
                const st = side.type === "DOUBLE" ? "double" : side.type.toLowerCase();
                set(prop, `${side.width ?? 0}mm ${st} black`);
              }
            };
            applySide(border.left, "border-left");
            applySide(border.right, "border-right");
            applySide(border.top, "border-top");
            applySide(border.bottom, "border-bottom");
          }
        }

        rules.push(`[data-style="${styleId}"] { ${decls.join("; ")}; }`);
      }

      // ─── outdent 보정: image(블록) / non-inline table은 padding-left 상쇄 ───
      if (composite.paragraph_style) {
        const para = this.getParagraphDef(composite.paragraph_style);
        if (para?.outdent) {
          rules.push(
            `[data-style="${styleId}"] img { display: block; margin-left: -${para.outdent}mm; }`,
            `[data-style="${styleId}"] table:not([data-inline-table]) { margin-left: -${para.outdent}mm; }`,
          );
        }
      }

      // ─── [data-style]::before : mark (리스트 마커) ───
      if (composite.paragraph_style) {
        const para = this.getParagraphDef(composite.paragraph_style);
        if (para?.mark) {
          const markText =
            typeof para.mark === "string" ? para.mark : para.mark.suffix ?? "";
          const spacing = "\\00a0 ".repeat(para.word_spacing_count ?? 0);
          const escaped = markText.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
          rules.push(`[data-style="${styleId}"]::before { content: "${spacing}${escaped} "; }`);
        }
      }

      // ─── [data-run-style] : character 속성 (Rust run/html.rs 기본값 패턴) ───
      if (composite.character_style) {
        const char = this.getCharacterDef(composite.character_style);
        if (char) {
          // Rust to_html 기본값 (run/html.rs 참조)
          const decls: string[] = [
            "font-weight: normal",
            "font-style: normal",
            "font-size: inherit",
            "font-family: inherit",
            "text-decoration: none",
            "color: inherit",
          ];
          const set = (key: string, value: string) => {
            const idx = decls.findIndex((d) => d.startsWith(`${key}:`));
            if (idx >= 0) decls[idx] = `${key}: ${value}`;
            else decls.push(`${key}: ${value}`);
          };

          if (char.size) set("font-size", `${char.size}pt`);
          if (char.face?.length) set("font-family", char.face.map((f) => `'${f}'`).join(", "));
          if (char.bold) set("font-weight", "bold");
          if (char.italic) set("font-style", "italic");
          if (char.underline) set("text-decoration", "underline");
          if (char.strike) set("text-decoration", "line-through");
          if (char.color) set("color", char.color);

          rules.push(`[data-run-style="${styleId}"] { ${decls.join("; ")}; }`);
        }
      }
    }

    return rules.join("\n");
  }
}
