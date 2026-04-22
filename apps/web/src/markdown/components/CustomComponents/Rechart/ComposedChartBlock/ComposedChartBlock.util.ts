import { chartTheme } from '@/markdown/chartTheme';
import { composedChartPropsSchema } from '@/markdown/components/CustomComponents/Rechart/ComposedChartBlock/ComposedChartBlock.schema';
import { z } from 'zod';

type Dataset = z.infer<typeof composedChartPropsSchema>['datasets'][number];

export interface BreakEvenPointInfo {
  x: number;
  y: number;
  yAxisId: string;
  label: string;
}

export type UnitResolver = (unit: string | undefined) => string;

// 막대·꺾은선 데이터를 그리기 좋은 순서로 정렬합니다.
export const sortSets = (raw: Dataset[]) =>
  [...raw].sort((a, b) => {
    if (a.type === 'bar' && b.type === 'line') return -1;
    if (a.type === 'line' && b.type === 'bar') return 1;
    return 0;
  });

// 라벨 기준으로 recharts 데이터 행을 만듭니다.
export const buildRows = (labels: string[], datasets: Dataset[]) =>
  labels.map((label, index) => {
    const row: Record<string, number | string> = { name: label, _index: index };
    datasets.forEach((dataset) => {
      row[dataset.key] = dataset.data[index];
    });
    return row;
  });

// Y축 값 자릿수에 맞춰 padding 값을 계산합니다.
export const padX = (datasets: Dataset[]) =>
  Math.max(...datasets.map((dataset) => Math.max(...dataset.data))).toString()
    .length * 2;

// 데이터들의 단위 조합으로 Y축 정보를 생성합니다.
export const yAxesOf = (datasets: Dataset[]) => {
  const unitMap = new Map<string, { label: string; unit: string }>();
  datasets.forEach((dataset) => {
    const unit = dataset.unit ?? '';
    if (!unitMap.has(unit)) {
      unitMap.set(unit, {
        label: dataset.key,
        unit
      });
    }
  });
  return Array.from(unitMap.values());
};

// 단위별 yAxisId 조회 함수를 만듭니다.
export const yAxisResolver = (datasets: Dataset[]): UnitResolver => {
  const unitToAxis = new Map<string, string>();
  datasets.forEach((dataset) => {
    const unit = dataset.unit ?? '';
    if (!unitToAxis.has(unit)) {
      unitToAxis.set(unit, dataset.key);
    }
  });
  return (unit: string | undefined) => unitToAxis.get(unit ?? '') ?? '';
};

// 현재 테마 키로 사용할 그래프 색상을 가져옵니다.
export const colorsOf = (colorKey: keyof typeof chartTheme) => [
  chartTheme[colorKey].primary1,
  chartTheme[colorKey].primary2,
  chartTheme[colorKey].primary3,
  chartTheme[colorKey].primary4,
  chartTheme[colorKey].primary5
];

// 막대 데이터 개수를 구합니다.
export const barTotal = (datasets: Dataset[]) =>
  datasets.filter((dataset) => dataset.type === 'bar').length;

// 꺾은선 데이터만 추출합니다.
export const lineSets = (datasets: Dataset[]) =>
  datasets.filter((dataset) => dataset.type === 'line');

// 꺾은선 두 개가 만나는 손익분기점을 찾습니다.
export const breakEven = (
  lines: Dataset[],
  labels: string[],
  resolveUnit: UnitResolver
): BreakEvenPointInfo | null => {
  if (lines.length !== 2) return null;
  const [first, second] = lines;
  const firstUnit = first.unit ?? '';
  const secondUnit = second.unit ?? '';
  if (firstUnit !== secondUnit) return null;
  if (
    first.data.length !== second.data.length ||
    first.data.length !== labels.length
  ) {
    return null;
  }

  let prevDiff = first.data[0] - second.data[0];
  if (prevDiff === 0) {
    return {
      x: 0,
      y: first.data[0],
      yAxisId: resolveUnit(first.unit),
      label: labels[0]
    };
  }

  for (let i = 1; i < labels.length; i++) {
    const diff = first.data[i] - second.data[i];

    if (diff === 0) {
      return {
        x: i,
        y: first.data[i],
        yAxisId: resolveUnit(first.unit),
        label: labels[i]
      };
    }

    if (prevDiff * diff < 0) {
      const yA0 = first.data[i - 1];
      const yA1 = first.data[i];
      const diffDenominator = prevDiff - diff;
      if (diffDenominator === 0) {
        return null;
      }

      const t = prevDiff / diffDenominator;
      const xPosition = i - 1 + t;
      const yValue = yA0 + t * (yA1 - yA0);
      return {
        x: xPosition,
        y: yValue,
        yAxisId: resolveUnit(first.unit),
        label: `${labels[i - 1]} ~ ${labels[i]}`
      };
    }

    prevDiff = diff;
  }

  return null;
};
