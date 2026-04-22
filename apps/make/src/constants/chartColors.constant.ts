import type { ColorKey } from '@docs-front/ui';

export const CHART_COLOR_KEYS = [
  'GRAY',
  'RED',
  'ORANGE',
  'YELLOW',
  'GREEN',
  'BLUE',
  'PURPLE',
  'PINK'
] as const;

export const CHART_COLORS: Record<(typeof CHART_COLOR_KEYS)[number], ColorKey> =
  {
    GRAY: 'chartBlack',
    RED: 'chartRed',
    ORANGE: 'chartOrange',
    YELLOW: 'chartYellow',
    GREEN: 'chartGreen',
    BLUE: 'chartBlue',
    PURPLE: 'chartPurple',
    PINK: 'chartPink'
  };
