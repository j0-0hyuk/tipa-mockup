import { CHART_COLOR_KEYS } from '@/constants/chartColors.constant';

export const chartTheme: Record<
  (typeof CHART_COLOR_KEYS)[number],
  {
    primary1: string;
    primary2: string;
    primary3: string;
    primary4: string;
    primary5: string;
    primary6: string;
    secondary: string;
    tertiary: string;
  }
> = {
  GRAY: {
    primary1: '#3A3A3A',
    primary2: '#F05C96',
    primary3: '#3182F7',
    primary4: '#8B4EDD',
    primary5: '#31A96B',
    primary6: '#F98A00',
    secondary: '#C6C6C6',
    tertiary: '#F0F0F0'
  },
  RED: {
    primary1: '#E74A47',
    primary2: '#3182F7',
    primary3: '#F98A00',
    primary4: '#31A96B',
    primary5: '#8B4EDD',
    primary6: '#EDB100',
    secondary: '#FAB9B7',
    tertiary: '#FDEAEA'
  },
  ORANGE: {
    primary1: '#F98A00',
    primary2: '#31A96B',
    primary3: '#3182F7',
    primary4: '#8B4EDD',
    primary5: '#3A3A3A',
    primary6: '#E74A47',
    secondary: '#FFD099',
    tertiary: '#FFF3E0'
  },
  YELLOW: {
    primary1: '#EDB100',
    primary2: '#E74A47',
    primary3: '#3182F7',
    primary4: '#F98A00',
    primary5: '#31A96B',
    primary6: '#F05C96',
    secondary: '#FAE07C',
    tertiary: '#FFF7D0'
  },
  GREEN: {
    primary1: '#31A96B',
    primary2: '#3182F7',
    primary3: '#EDB100',
    primary4: '#E74A47',
    primary5: '#8B4EDD',
    primary6: '#F05C96',
    secondary: '#A1ECC5',
    tertiary: '#E2F9ED'
  },
  BLUE: {
    primary1: '#3182F7',
    primary2: '#F05C96',
    primary3: '#EDB100',
    primary4: '#31A96B',
    primary5: '#8B4EDD',
    primary6: '#3A3A3A',
    secondary: '#A2CCFE',
    tertiary: '#E3EEFF'
  },
  PURPLE: {
    primary1: '#8B4EDD',
    primary2: '#31A96B',
    primary3: '#F05C96',
    primary4: '#3182F7',
    primary5: '#EDB100',
    primary6: '#E74A47',
    secondary: '#DDC6FA',
    tertiary: '#F1EAFE'
  },
  PINK: {
    primary1: '#F05C96',
    primary2: '#8B4EDD',
    primary3: '#EDB100',
    primary4: '#3182F7',
    primary5: '#31A96B',
    primary6: '#3A3A3A',
    secondary: '#FDC2D5',
    tertiary: '#FFEEF4'
  }
};
