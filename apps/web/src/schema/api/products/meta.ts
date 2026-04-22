import { z } from 'zod';
import { CHART_COLOR_KEYS } from '@/constants/chartColors.constant';

export const patchProductMetaSchema = z.object({
  themeColor: z.enum(CHART_COLOR_KEYS).optional(),
  itemName: z.string().optional()
});

export type PatchProductMetaRequestParams = z.input<
  typeof patchProductMetaSchema
>;
