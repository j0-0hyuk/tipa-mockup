import { chartTheme } from '@/make/pages/demo/loading/chartTheme';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Label,
  LabelList,
  Legend,
  Line,
  XAxis,
  YAxis,
  type LegendPayload
} from 'recharts';
import { composedChartPropsSchema } from '@/make/pages/demo/loading/components/CustomComponents/Rechart/ComposedChartBlock/ComposedChartBlock.schema';
import { useMemo } from 'react';
import { useTheme } from '@emotion/react';
import { z } from 'zod';
import { Flex, Tooltip } from '@/packages/ui/src';
import {
  LegendColor,
  LegendText,
  Styledtspan
} from '@/make/pages/demo/loading/components/CustomComponents/Rechart/ComposedChartBlock/ComposedChartBlock.style';

interface ComposedChartComponentProps {
  composedChartProps: z.infer<typeof composedChartPropsSchema>;
}

export const ComposedChartComponent = ({
  composedChartProps
}: ComposedChartComponentProps) => {
  const { labels, datasets: rawDatasets, title } = composedChartProps;

  /** line이 무조건 앞에 오도록 수정 */
  const datasets = useMemo(
    () =>
      [...rawDatasets].sort((a, b) => {
        if (a.type === 'bar' && b.type === 'line') return -1;
        if (a.type === 'line' && b.type === 'bar') return 1;
        return 0;
      }),
    [rawDatasets]
  );

  const theme = useTheme();
  const colorKey = 'GRAY';
  const data = useMemo(
    () =>
      labels.map((label, index) => {
        const obj: Record<string, number | string> = { name: label };
        datasets.map((dataset) => {
          obj[dataset.key] = dataset.data[index];
        });
        return obj;
      }),
    [labels, datasets]
  );

  const categories = useMemo(
    () =>
      datasets.map((dataset) => ({
        label: dataset.label,
        type: dataset.type,
        yAxis: {
          label: dataset.key,
          unit: dataset.unit ?? ''
        }
      })),
    [datasets]
  );

  const paddingX = useMemo(() => {
    return (
      Math.max(
        ...datasets.map((dataset) => Math.max(...dataset.data))
      ).toString().length * 2
    );
  }, [datasets]);

  const yAxes = useMemo(
    () =>
      categories
        .map((category) => category.yAxis)
        .filter(
          (yAxis, index, self) =>
            index === self.findIndex((t) => t.unit === yAxis.unit)
        ),
    [categories]
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
        top: 59,
        right: yAxes.length === 1 ? paddingX + 50 : paddingX + 20,
        left: 20 + paddingX,
        bottom: 20
      }}
      data={data}
    >
      <Tooltip
        content={`${title} (단위: ${yAxes.map((yAxis) => yAxis.unit).join(' / ')})`}
      >
        <text x={560 / 2} y={20} textAnchor="middle" dominantBaseline="hanging">
          <Styledtspan>
            [{title.length > 32 ? title.substring(0, 32) + '...' : title} (
            단위: {yAxes.map((yAxis) => yAxis.unit).join(' / ')})]
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
      />
      <CartesianGrid
        vertical={false}
        yAxisId={yAxes[0].label}
        strokeDasharray="3 3"
      />
      <XAxis fontSize={12} tickLine={false} dataKey="name" />
      {yAxes.map((yAxis, index) => {
        return (
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
        );
      })}
      {datasets.map((dataset, index) => {
        const graphColor = (function () {
          if (index === 0) {
            return chartTheme[colorKey].primary1;
          } else if (index === 1) {
            return chartTheme[colorKey].primary2;
          } else if (index === 2) {
            return chartTheme[colorKey].primary3;
          } else if (index === 3) {
            return chartTheme[colorKey].primary4;
          } else if (index === 4) {
            return chartTheme[colorKey].primary5;
          }
        })();

        if (dataset.type === 'bar') {
          return (
            <Bar
              fontSize={12}
              name={dataset.label}
              yAxisId={dataset.key}
              key={dataset.key}
              dataKey={dataset.key}
              fill={graphColor}
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            >
              <LabelList
                fontSize={13}
                fontWeight={500}
                offset={8}
                dataKey={dataset.key}
                position="insideTop"
                fill={theme.color.white}
              />
            </Bar>
          );
        } else if (dataset.type === 'line') {
          return (
            <Line
              fontSize={12}
              name={dataset.label}
              yAxisId={dataset.key}
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
    </ComposedChart>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomLegendContent = (props: any) => {
  const { originalDatasets } = props;

  return (
    <Flex
      width="fit-content"
      margin="0px 0px 12px 0px"
      direction="row"
      justify="center"
      gap={12}
    >
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
              <Flex width="fit-content" alignItems="center" direction="row">
                <LegendColor backgroundColor={colorEntry?.color || ''} />
                <LegendText style={{ whiteSpace: 'pre-line' }}>
                  {dataset.label ? dataset.label : ''}
                </LegendText>
              </Flex>
            </Tooltip>
          );
        }
      )}
    </Flex>
  );
};
