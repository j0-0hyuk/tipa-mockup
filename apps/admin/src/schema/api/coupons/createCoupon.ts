import { z } from 'zod';

export const couponDiscountTypeSchema = z.enum(['PERCENTAGE', 'FIXED_AMOUNT']);

export const createCouponRequestSchema = z.object({
  code: z.string().optional(),
  description: z.string().min(1, '설명을 입력해주세요'),
  discountType: couponDiscountTypeSchema,
  discountValue: z.string().min(1, '할인 값을 입력해주세요'),
  amount: z.number().min(1, '개수는 1개 이상이어야 합니다').optional(),
  expiresAt: z.string().optional(),
  restrictToProductIds: z.array(z.string()).optional(),
  maxRecurringIntervals: z
    .number()
    .min(1, '최소 1회 이상이어야 합니다')
    .optional()
});

export type CreateCouponRequest = z.infer<typeof createCouponRequestSchema>;
export type CouponDiscountType = z.infer<typeof couponDiscountTypeSchema>;
