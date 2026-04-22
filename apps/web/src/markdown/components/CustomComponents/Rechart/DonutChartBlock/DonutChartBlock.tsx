import { donutChartPropsSchema } from '@/markdown/components/CustomComponents/Rechart/DonutChartBlock/DonutChartBlock.schema';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  type LegendPayload,
  type PieLabelRenderProps
} from 'recharts';
import { chartTheme } from '@/markdown/chartTheme';
import { z } from 'zod';
import { useChartColorKey } from '@/hooks/useChartColorKey';
import type { ReactNode } from 'react';
import { Tooltip } from '@docs-front/ui';
import { Flex } from '@docs-front/ui';
import {
  LegendColor,
  LegendText,
  Styledtspan
} from '@/markdown/components/CustomComponents/Rechart/DonutChartBlock/DonutChartBlock.style';

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent
}: PieLabelRenderProps): ReactNode => {
  const radius = ((innerRadius as number) + (outerRadius as number)) / 2;
  const x =
    (cx as number) + radius * Math.cos(-(midAngle ?? 0) * (Math.PI / 180));
  const y =
    (cy as number) + radius * Math.sin(-(midAngle ?? 0) * (Math.PI / 180));

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={16}
      fontWeight={700}
    >
      {`${(((percent ?? 1) as number) * 100).toFixed(0)}%`}
    </text>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomLegendContent = (props: any) => {
  const { originalData } = props;
  return (
    <Flex direction="column" gap={12}>
      {originalData?.map(
        (entry: { category: string; percentage: number }, index: number) => {
          const colorEntry = props.payload?.find(
            (payload: LegendPayload) => payload.value === entry.category
          );
          return (
            <Tooltip key={index} content={entry.category || ''}>
              <Flex alignItems="center">
                <LegendColor backgroundColor={colorEntry?.color || ''} />
                <LegendText style={{ whiteSpace: 'pre-line' }}>
                  {entry.category ? entry.category : ''}
                </LegendText>
              </Flex>
            </Tooltip>
          );
        }
      )}
    </Flex>
  );
};

export const DonutChartComponent = ({
  donutChartProps
}: {
  donutChartProps: z.infer<typeof donutChartPropsSchema>;
}) => {
  const { title, distribution } = donutChartProps;

  const { colorKey } = useChartColorKey();

  return (
    <PieChart
      width={580}
      height={420}
      margin={{ top: 50, right: 10, bottom: 20, left: 10 }}
      style={{
        outline: 'none'
      }}
    >
      <Tooltip content={title}>
        <text
          x={768 / 3.25}
          y={35}
          textAnchor="middle"
          dominantBaseline="hanging"
        >
          <Styledtspan>
            [{title.length > 32 ? title.substring(0, 32) + '...' : title}]
          </Styledtspan>
        </text>
      </Tooltip>
      <Pie
        data={distribution}
        dataKey="percentage"
        nameKey="category"
        cx="40%"
        cy="50%"
        outerRadius={160}
        innerRadius={100}
        labelLine={false}
        label={renderCustomizedLabel}
        isAnimationActive={false}
        startAngle={450}
        endAngle={90}
      >
        {distribution.map((entry, index) => (
          <Cell
            key={`cell-${entry.category}`}
            fill={(function () {
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
              } else {
                return chartTheme[colorKey].primary6;
              }
            })()}
          />
        ))}
      </Pie>
      <Legend
        content={(props) => (
          <CustomLegendContent {...props} originalData={distribution} />
        )}
        layout="vertical"
        align="right"
        verticalAlign="middle"
      />
    </PieChart>
  );
};
