import { chartTheme } from '@/markdown/chartTheme';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Label,
  LabelList,
  Legend,
  Line,
  ReferenceDot,
  XAxis,
  YAxis,
  type LegendPayload
} from 'recharts';
import { composedChartPropsSchema } from '@/markdown/components/CustomComponents/Rechart/ComposedChartBlock/ComposedChartBlock.schema';
import { useMemo } from 'react';
import { useTheme } from '@emotion/react';
import { z } from 'zod';
import { useChartColorKey } from '@/hooks/useChartColorKey';
import { useI18n } from '@/hooks/useI18n';
import { Flex, Tooltip } from '@docs-front/ui';
import {
  LegendColor,
  LegendText,
  Styledtspan
} from '@/markdown/components/CustomComponents/Rechart/ComposedChartBlock/ComposedChartBlock.style';
import {
  barTotal,
  breakEven,
  buildRows,
  colorsOf,
  lineSets,
  padX,
  sortSets,
  yAxesOf,
  yAxisResolver
} from '@/markdown/components/CustomComponents/Rechart/ComposedChartBlock/ComposedChartBlock.util';

interface ComposedChartComponentProps {
  composedChartProps: z.infer<typeof composedChartPropsSchema>;
}

export const ComposedChartComponent = ({
  composedChartProps
}: ComposedChartComponentProps) => {
  const { labels, datasets: rawDatasets, title } = composedChartProps;

  const datasets = useMemo(() => sortSets(rawDatasets), [rawDatasets]);

  const theme = useTheme();
  const { colorKey } = useChartColorKey();
  const { t } = useI18n(['main']);
  const breakEvenText = t('main:chart.breakEvenPoint');
  const data = useMemo(() => buildRows(labels, datasets), [labels, datasets]);

  const paddingX = useMemo(() => padX(datasets), [datasets]);

  const yAxes = useMemo(() => yAxesOf(datasets), [datasets]);
  const getYAxisIdByUnit = useMemo(() => yAxisResolver(datasets), [datasets]);
  const graphColors = useMemo(() => colorsOf(colorKey), [colorKey]);
  const barCount = useMemo(() => barTotal(datasets), [datasets]);
  const shouldShowBarNumbers = barCount < 3;
  const lineDatasets = useMemo(() => lineSets(datasets), [datasets]);
  const breakEvenPoint = useMemo(
    () => breakEven(lineDatasets, labels, getYAxisIdByUnit),
    [getYAxisIdByUnit, labels, lineDatasets]
  );

  if (yAxes.length > 2) {
    return <div>Error</div>;
  }

  return (
    <ComposedChart
      style={{
        margin: '6px 0px',
        outline: 'none'
      }}
      title={title}
      width={567}
      height={429}
      margin={{
        top: 64,
        right: yAxes.length === 1 ? paddingX + 50 : paddingX + 20,
        left: 20 + paddingX,
        bottom: 32
      }}
      data={data}
    >
      <Tooltip
        content={`${title} (${t('main:chart.unit')}: ${yAxes.map((yAxis) => yAxis.unit).join(' / ')})`}
      >
        <text x={560 / 2} y={10} textAnchor="middle" dominantBaseline="hanging">
          <Styledtspan>
            [{title.length > 32 ? title.substring(0, 32) + '...' : title} (
            {t('main:chart.unit')}:{' '}
            {yAxes.map((yAxis) => yAxis.unit).join(' / ')})]
          </Styledtspan>
        </text>
      </Tooltip>
      <Legend
        content={(props) => (
          <CustomLegendContent {...props} originalDatasets={rawDatasets} />
        )}
        layout="vertical"
        align="center"
        verticalAlign="top"
        wrapperStyle={{
          top: 32
        }}
      />
      <CartesianGrid
        vertical={false}
        yAxisId={yAxes[0].label}
        strokeDasharray="3 3"
      />
      <XAxis fontSize={12} tickLine={false} dataKey="name" />
      <XAxis xAxisId="breakEven" dataKey="_index" type="number" hide />
      {yAxes.map((yAxis, index) => (
        <YAxis
          fontSize={12}
          fontWeight={400}
          tickLine={false}
          orientation={index === 1 ? 'right' : 'left'}
          yAxisId={yAxis.label}
          key={yAxis.label}
          tickCount={8}
        >
          <Label
            value={`${yAxis.label} (${yAxis.unit})`}
            angle={index === 1 ? 90 : -90}
            position={index === 1 ? 'insideLeft' : 'insideRight'}
            offset={50 + paddingX}
            fill={theme.color.black}
            fontSize={12}
            fontWeight={400}
            style={{
              textAnchor: 'middle'
            }}
          />
        </YAxis>
      ))}
      {datasets.map((dataset, index) => {
        const graphColor = graphColors[index] || graphColors[0];
        const yAxisId = getYAxisIdByUnit(dataset.unit);

        if (dataset.type === 'bar') {
          return (
            <Bar
              fontSize={12}
              name={dataset.label}
              yAxisId={yAxisId}
              key={dataset.key}
              dataKey={dataset.key}
              fill={graphColor}
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            >
              {shouldShowBarNumbers && (
                <LabelList
                  fontSize={13}
                  fontWeight={500}
                  offset={8}
                  dataKey={dataset.key}
                  position="insideTop"
                  fill={theme.color.white}
                />
              )}
            </Bar>
          );
        } else if (dataset.type === 'line') {
          return (
            <Line
              fontSize={12}
              name={dataset.label}
              yAxisId={yAxisId}
              key={dataset.key}
              dataKey={dataset.key}
              stroke={graphColor}
              fill={graphColor}
              strokeWidth={2}
              isAnimationActive={false}
            />
          );
        }
      })}
      {breakEvenPoint && (
        <ReferenceDot
          xAxisId="breakEven"
          yAxisId={breakEvenPoint.yAxisId}
          x={breakEvenPoint.x}
          y={breakEvenPoint.y}
          r={6}
          fill={chartTheme[colorKey].primary6}
          stroke={theme.color.white}
          strokeWidth={2}
        >
          <Label
            position="top"
            fill={theme.color.black}
            fontSize={12}
            fontWeight={500}
            value={breakEvenText}
          />
        </ReferenceDot>
      )}
    </ComposedChart>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomLegendContent = (props: any) => {
  const { originalDatasets } = props;

  return (
    <Flex width="fit-content" direction="row" justify="center" gap={12}>
      {originalDatasets?.map(
        (
          dataset: { label: string; key: string; type: string; data: number[] },
          index: number
        ) => {
          const colorEntry = props.payload?.find(
            (payload: LegendPayload) => payload.value === dataset.label
          );

          return (
            <Tooltip key={index} content={dataset.label || ''}>
              <Flex
                width="fit-content"
                alignItems="center"
                justify="center"
                direction="row"
                style={{ flexShrink: 0 }}
              >
                <LegendColor backgroundColor={colorEntry?.color || ''} />
                <LegendText>{dataset.label || ''}</LegendText>
              </Flex>
            </Tooltip>
          );
        }
      )}
    </Flex>
  );
};
