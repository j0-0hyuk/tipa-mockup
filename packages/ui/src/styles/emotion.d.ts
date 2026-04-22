import '@emotion/react';

type Typography = {
  Sb_32: string;
  Sb_24: string;
  Sb_20: string;
  Sb_18: string;
  Sb_16: string;
  Sb_14: string;
  Md_18: string;
  Md_16: string;
  Md_15: string;
  Md_14: string;
  Md_13: string;
  Md_12: string;
  Rg_16: string;
  Rg_15: string;
  Rg_14: string;
  Rg_13: string;
  Rg_12: string;
};

type BasicColor = {
  blue: Record<100 | 300 | 500 | 700 | 900, string>;
  grey: Record<
    50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
    string
  >;
  black: string;
  white: string;
  black30: string;
  red: Record<100 | 500 | 700, string>;
};

type SemanticColor = {
  none: string;
  black: string;
  white: string;
  borderGray: string;
  borderLightGray: string;
  bgBlueGray: string;
  bgGray: string;
  bgLightGray: string;
  bgMediumGray: string;
  bgDarkGray: string;
  textGray: string;
  textGray2: string;
  textPlaceholder: string;
  shinhan: string;
  main: string;
  bgMain: string;
  bgGradient: string;
  blueGradient: string;
  angular: string;
  chartBlack: string;
  chartRed: string;
  chartOrange: string;
  chartYellow: string;
  chartGreen: string;
  chartBlue: string;
  chartPurple: string;
  chartPink: string;
  error: string;
  errorBg: string;
  brandBlue: string;
  lightBlueBg: string;
  brightBlue: string;
  // 신규 semantic (마이그레이션용)
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textDisabled: string;
  lineLight: string;
  lineDefault: string;
  lineAccent: string;
  lineWarning: string;
  bgWhite: string;
  bgLightGrey: string;
  bgMediumGrey: string;
  bgDarkGrey: string;
  bgBlack: string;
  bgAccent: string;
  bgAccentDark: string;
  bgAccentSubtle: string;
  bgWarning: string;
  bgWarningDark: string;
  bgWarningSubtle: string;
  textAccent: string;
  textWarning: string;
};

type Color = { basic: BasicColor } & SemanticColor;

type BorderRadius = {
  none: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
  xxxl: string;
  full: string;
};

type Spacing = {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
  xxxl: string;
  cardWidth: string;
  cardContainerWidth: string;
  modalWidth: string;
  cardWidth: string;
};

type Gradient = {
  lightBlue: string;
  brandBlue: string;
  blueGlassGradient: string;
};

type Shadow = {
  modal: string;
};

export type TypographyKey = keyof Typography;
export type ColorKey = keyof Color;
export type BorderRadiusKey = keyof BorderRadius;
export type SpacingKey = keyof Spacing;
export type GradientKey = keyof Gradient;

declare module '@emotion/react' {
  export interface Theme {
    color: Color;
    typo: Typography;
    borderRadius: BorderRadius;
    spacing: Spacing;
    gradient: Gradient;
    shadow: Shadow;
    // Temporary bridge for @bichon/ds migration.
    colors?: Color;
    radius?: BorderRadius;
    shadows?: Shadow;
  }
}
