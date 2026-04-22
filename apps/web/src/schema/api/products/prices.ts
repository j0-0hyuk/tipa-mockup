import { z } from 'zod';
import { tossItemTypeSchema } from '@/schema/api/payments/toss';

// 상품 가격 정보 스키마
export const productPriceSchema = z.object({
  itemType: tossItemTypeSchema,
  name: z.string(),
  krw: z.number().int().positive(),
  usd: z.number().int().positive()
});

export type ProductPrice = z.infer<typeof productPriceSchema>;

// 상품 가격 데이터 스키마
export const productPricesDataSchema = z.object({
  MONTHLY_PASS: productPriceSchema,
  SEASON_PASS: productPriceSchema
});

// 상품 가격 목록 응답 스키마 (백엔드 래핑)
export const getProductPricesResponseSchema = z.object({
  data: productPricesDataSchema
});

export type GetProductPricesResponse = z.infer<
  typeof getProductPricesResponseSchema
>;

// 상품 키 타입 (MONTHLY_PASS, SEASON_PASS)
export type ProductKey = keyof z.infer<typeof productPricesDataSchema>;
