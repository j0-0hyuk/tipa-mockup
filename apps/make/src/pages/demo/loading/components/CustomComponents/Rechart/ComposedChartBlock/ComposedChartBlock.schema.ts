import { z } from 'zod';

const yAxisSchema = z.object({
  label: z.string(),
  unit: z.string().optional()
});

const categorySchema = z.object({
  label: z.string(),
  type: z.enum(['bar', 'line']),
  yAxis: yAxisSchema
});

export const composedChartPropsSchema = z.object({
  info: z.string().optional(),
  title: z.string(),
  labels: z.array(z.string()),
  datasets: z
    .array(
      z.object({
        key: z.string(),
        label: z.string(),
        type: z.enum(['bar', 'line']),
        unit: z.string().optional(),
        data: z.array(z.number())
      })
    )
    .max(5)
});

export const composedChartFormSchema = z
  .object({
    title: z.string(),
    categories: z.array(categorySchema).max(5),
    yAxes: z.array(yAxisSchema).max(2),
    datasets: z.array(
      z.object({
        label: z.string(),
        data: z.array(
          z.object({
            category: categorySchema,
            value: z.number()
          })
        )
      })
    )
  })
  .refine(
    ({ datasets }) => {
      if (datasets.length === 0) return true;
      const dataLength = datasets[0].data.length;
      return datasets.every((dataset) => dataset.data.length === dataLength);
    },
    {
      message: '모든 데이터의 길이가 같아야 합니다.',
      path: ['datasets']
    }
  )
  .refine(
    ({ categories, datasets }) => {
      if (categories.length === 0) return true;
      return categories.every((category) =>
        datasets.some((dataset) =>
          dataset.data.some((data) => data.category.label === category.label)
        )
      );
    },
    {
      message: '모든 카테고리에 데이터가 있어야 합니다.',
      path: ['categories']
    }
  )
  .refine(
    ({ categories, yAxes }) => {
      return categories.every((category) =>
        yAxes.some((yAxis) => yAxis.label === category.yAxis.label)
      );
    },
    {
      message: '카테고리의 단위는 yAxes 배열에 있어야 합니다.',
      path: ['categories', 'yAxes']
    }
  );

export const composedChartFormToPropsSchema = composedChartFormSchema.transform(
  ({ title, categories, datasets }) => {
    return {
      title: title,
      labels: datasets.map((dataset) => dataset.label),
      datasets: categories.map((category) => ({
        key: category.yAxis.label,
        label: category.label,
        type: category.type,
        unit: category.yAxis.unit,
        data: datasets.map(
          (dataset) =>
            dataset.data.find((data) => data.category.label === category.label)
              ?.value ?? 0
        )
      }))
    };
  }
);

export type ComposedChartFormValue = z.infer<typeof composedChartFormSchema>;
