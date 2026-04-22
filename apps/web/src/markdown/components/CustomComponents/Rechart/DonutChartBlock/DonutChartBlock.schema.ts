import { z } from 'zod';

export const donutChartPropsSchema = z.object({
  info: z.string().optional(),
  title: z.string(),
  distribution: z.array(
    z.object({
      category: z.string(),
      percentage: z.number()
    })
  )
});
