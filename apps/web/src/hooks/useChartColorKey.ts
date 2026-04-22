import type { CHART_COLOR_KEYS } from '@/constants/chartColors.constant';
import { createContext, useContext } from 'react';

export const ChartColorKeyContext = createContext<{
  colorKey: (typeof CHART_COLOR_KEYS)[number];
}>({
  colorKey: 'GRAY'
});

export const useChartColorKey = () => {
  const context = useContext(ChartColorKeyContext);

  if (!context) {
    throw new Error('useChartColorKey must be used within a ChartColorKeyProvider');
  }

  return context;
};
