import { z } from 'zod';

export const priceInfoSchema = z.object({
  id: z.string(),
  type: z.string()
});

export const listPricesResponseSchema = z.object({
  data: z.object({
    data: z.array(priceInfoSchema)
  })
});

export type PriceInfo = z.infer<typeof priceInfoSchema>;
export type ListPricesResponse = z.infer<typeof listPricesResponseSchema>;
