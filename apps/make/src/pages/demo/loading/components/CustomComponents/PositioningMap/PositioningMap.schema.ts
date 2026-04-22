import { z } from 'zod';

export const positioningMapDataSchema = z.array(
  z.object({
    name: z.string(),
    x: z.number(),
    y: z.number()
  })
);

export const positioningMapPropsSchema = z.object({
  info: z.string().optional(),
  title: z.string(),
  negativeXName: z.string(),
  positiveXName: z.string(),
  negativeYName: z.string(),
  positiveYName: z.string(),
  data: positioningMapDataSchema
});

export type ReactPositioningMapRenderProps = z.infer<
  typeof positioningMapPropsSchema
>;
