export interface DiffStyleTokens {
  bgWarningSubtle: string;
  bgAccentSubtle: string;
  bgAccent: string;
  bgAccentDark: string;
  bgWhite: string;
  bgMediumGrey: string;
  lineDefault: string;
  textPrimary: string;
  radiusSm: string;
  radiusLg: string;
}

/** Hardcoded fallback tokens (no @bichon/ds dependency) */
export const defaultDiffTokens: DiffStyleTokens = {
  bgWarningSubtle: "#fef2f2",
  bgAccentSubtle: "#eff6ff",
  bgAccent: "#3b82f6",
  bgAccentDark: "#2563eb",
  bgWhite: "#ffffff",
  bgMediumGrey: "#f3f4f6",
  lineDefault: "#e5e7eb",
  textPrimary: "#111827",
  radiusSm: "4px",
  radiusLg: "8px",
};
