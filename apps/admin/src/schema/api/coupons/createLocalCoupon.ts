import { z } from 'zod';

export const createLocalCouponRequestSchema = z.object({
  couponCode: z.string().min(1, '쿠폰 코드를 입력해주세요'),
  credit: z.number().min(1, '크레딧은 1 이상이어야 합니다')
});

export type CreateLocalCouponRequest = z.infer<typeof createLocalCouponRequestSchema>;
