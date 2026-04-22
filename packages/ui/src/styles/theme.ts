import type { Theme } from '@emotion/react';

type ThemeBase = Omit<Theme, 'colors' | 'radius' | 'shadows'>;

/** Color (basic) */
const basicColor = {
  blue: {
    100: '#EAF3FF',
    300: '#ABCDFF',
    500: '#2C81FC',
    700: '#0C52B8',
    900: '#002F74'
  },
  grey: {
    50: '#FAFAFC',
    100: '#F1F1F4',
    200: '#E3E4E8',
    300: '#B5B9C4',
    400: '#949AA8',
    500: '#6E7687',
    600: '#596070',
    700: '#4B505D',
    800: '#3F434D',
    900: '#25262C'
  },
  black: '#25262C',
  white: '#FFFFFF',
  black30: 'rgba(37, 38, 44, 0.3)', // black 30% opacity
  red: {
    100: '#FFECEE',
    500: '#F04452',
    700: '#AC202B'
  }
} as const;

const themeBase: ThemeBase = {
  color: {
    basic: basicColor,
    // 구 Color(semantic).
    none: 'transparent',
    main: basicColor.blue[500],
    white: basicColor.white,
    black: basicColor.black,
    textGray: basicColor.grey[500],
    textGray2: basicColor.grey[400],
    textPlaceholder: basicColor.grey[300],
    shinhan: '#0046FF',
    bgMain: basicColor.blue[100],
    bgBlueGray: basicColor.grey[100],
    bgGray: basicColor.grey[50],
    bgLightGray: basicColor.grey[50],
    bgMediumGray: basicColor.grey[200],
    bgDarkGray: basicColor.grey[800],
    borderGray: basicColor.grey[200],
    borderLightGray: basicColor.grey[100],
    bgGradient: basicColor.blue[100],
    blueGradient: basicColor.blue[300],
    angular: basicColor.blue[300],
    chartBlack: basicColor.grey[900],
    chartRed: basicColor.red[500],
    chartOrange: '#F98A00',
    chartYellow: '#EDB100',
    chartGreen: '#31A96B',
    chartBlue: basicColor.blue[500],
    chartPurple: '#8B4EDD',
    chartPink: '#F05C96',
    error: basicColor.red[500],
    errorBg: basicColor.red[100],
    brandBlue: basicColor.blue[700],
    lightBlueBg: basicColor.blue[100],
    brightBlue: basicColor.blue[300],

    // 신규 Color(semantic). 마이그레이션용으로 기존 키 유지, 밑에 추가.
    // Font
    textPrimary: basicColor.grey[900],
    textSecondary: basicColor.grey[600],
    textTertiary: basicColor.grey[500],
    textDisabled: basicColor.grey[300],
    // Line
    lineLight: basicColor.grey[100],
    lineDefault: basicColor.grey[200],
    lineAccent: basicColor.blue[500],
    lineWarning: basicColor.red[500],
    // Background
    bgWhite: basicColor.white,
    bgLightGrey: basicColor.grey[50],
    bgMediumGrey: basicColor.grey[100],
    bgDarkGrey: basicColor.grey[800],
    bgBlack: basicColor.grey[900],
    bgAccent: basicColor.blue[500],
    bgAccentDark: basicColor.blue[700],
    bgAccentSubtle: basicColor.blue[100],
    bgWarning: basicColor.red[500],
    bgWarningDark: basicColor.red[700],
    bgWarningSubtle: basicColor.red[100],
    // Status
    textAccent: basicColor.blue[500],
    textWarning: basicColor.red[500]
  },
  borderRadius: {
    none: '0px',
    xs: '2px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '10px',
    xxl: '12px',
    xxxl: '20px',
    full: '9999px'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
    cardWidth: '286px',
    cardContainerWidth: '334px',
    modalWidth: '400px'
  },
  gradient: {
    lightBlue: 'linear-gradient(180deg, #d7e7ff 0%, #ffffff 30%)',
    brandBlue: 'linear-gradient(89.32deg, #5d98f6 5.18%, #106af9 75.67%)',
    blueGlassGradient:
      'linear-gradient(135deg, #2082f8 0%, #94c4fd 33%, #ecf5ff 66%, #c4defe 100%)'
  },
  shadow: {
    modal: '0px 4px 12px 0px rgba(0, 27, 55, 0.15)'
  },
  typo: {
    Sb_32: `
      font-size: 32px;
      line-height: 42px;
      font-weight: 600;
      letter-spacing: -0.02em;
    `,
    Sb_24: `
      font-size: 24px;
      line-height: 32px;
      font-weight: 600;
      letter-spacing: -0.02em;
    `,
    Sb_20: `
      font-size: 20px;
      line-height: 29px;
      font-weight: 600;
      letter-spacing: -0.02em;
    `,
    Sb_18: `
      font-size: 18px;
      line-height: 27px;
      font-weight: 600;
      letter-spacing: -0.02em;
    `,
    Sb_16: `
      font-size: 16px;
      line-height: 24px;
      font-weight: 600;
      letter-spacing: -0.02em;
    `,
    Sb_14: `
      font-size: 14px;
      line-height: 21px;
      font-weight: 600;
      letter-spacing: -0.02em;
    `,
    Md_18: `
      font-size: 18px;
      line-height: 27px;
      font-weight: 500;
      letter-spacing: -0.02em;
    `,
    Md_16: `
      font-size: 16px;
      line-height: 24px;
      font-weight: 500;
      letter-spacing: -0.02em;
    `,
    Md_15: `
      font-size: 15px;
      line-height: 22.5px;
      font-weight: 500;
      letter-spacing: -0.02em;
    `,
    Md_14: `
      font-size: 14px;
      line-height: 21px;
      font-weight: 500;
      letter-spacing: -0.02em;
    `,
    Md_13: `
      font-size: 13px;
      line-height: 19.5px;
      font-weight: 500;
      letter-spacing: -0.02em;
    `,
    Md_12: `
      font-size: 12px;
      line-height: 18px;
      font-weight: 500;
      letter-spacing: -0.02em;
    `,
    Rg_16: `
      font-size: 16px;
      line-height: 24px;
      font-weight: 400;
      letter-spacing: -0.02em;
    `,
    Rg_15: `
      font-size: 15px;
      line-height: 22.5px;
      font-weight: 400;
      letter-spacing: -0.02em;
    `,
    Rg_14: `
      font-size: 14px;
      line-height: 21px;
      font-weight: 400;
      letter-spacing: -0.02em;
    `,
    Rg_13: `
      font-size: 13px;
      line-height: 19.5px;
      font-weight: 400;
      letter-spacing: -0.02em;
    `,
    Rg_12: `
      font-size: 12px;
      line-height: 18px;
      font-weight: 400;
      letter-spacing: -0.02em;
    `
  }
};

export const theme: Theme = {
  ...themeBase,
  // Temporary bridge for @bichon/ds migration:
  // old keys: color/borderRadius/shadow -> new keys: colors/radius/shadows
  colors: themeBase.color,
  radius: themeBase.borderRadius,
  shadows: themeBase.shadow
};
