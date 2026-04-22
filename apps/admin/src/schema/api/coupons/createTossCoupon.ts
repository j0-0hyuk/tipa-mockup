import { z } from 'zod';

// 쿠폰 혜택 타입
export const tossCouponBenefitTypeSchema = z.enum(['DISCOUNT', 'DURATION']);
export type TossCouponBenefitType = z.infer<typeof tossCouponBenefitTypeSchema>;

// 쿠폰 할인 타입
export const tossCouponTypeSchema = z.enum(['AMOUNT', 'PERCENT']);
export type TossCouponType = z.infer<typeof tossCouponTypeSchema>;

// 쿠폰 적용 대상
export const tossCouponTargetSchema = z.enum(['ALL', 'MONTHLY_PASS', 'SEASON_PASS']);
export type TossCouponTarget = z.infer<typeof tossCouponTargetSchema>;

// 쿠폰 상태
export const tossCouponStatusSchema = z.enum(['ACTIVE', 'INACTIVE']);
export type TossCouponStatus = z.infer<typeof tossCouponStatusSchema>;

// 토스페이먼츠 쿠폰 생성 요청 스키마
export const createTossCouponRequestSchema = z
  .object({
    code: z.string().min(1, '쿠폰 코드를 입력해주세요'),
    description: z.string().optional(),
    benefitType: tossCouponBenefitTypeSchema,
    type: tossCouponTypeSchema.optional(),
    amount: z.number().positive('금액은 0보다 커야 합니다').optional().nullable(),
    percent: z
      .number()
      .min(1, '할인율은 1% 이상이어야 합니다')
      .max(100, '할인율은 100% 이하여야 합니다')
      .optional()
      .nullable(),
    durationMonths: z
      .number()
      .min(1, '기간은 1개월 이상이어야 합니다')
      .optional()
      .nullable(),
    startsAt: z.string().optional().nullable(),
    endsAt: z.string().optional().nullable(),
    maxUses: z.number().min(1, '최대 사용 횟수는 1 이상이어야 합니다'),
    target: tossCouponTargetSchema,
    status: tossCouponStatusSchema
  })
  .refine(
    (data) => {
      // DISCOUNT 타입이면 type 필수
      if (data.benefitType === 'DISCOUNT') {
        return data.type !== undefined && data.type !== null;
      }
      return true;
    },
    { message: '할인 쿠폰은 할인 타입을 선택해주세요', path: ['type'] }
  )
  .refine(
    (data) => {
      // DISCOUNT + AMOUNT이면 amount 필수
      if (data.benefitType === 'DISCOUNT' && data.type === 'AMOUNT') {
        return data.amount !== undefined && data.amount !== null;
      }
      return true;
    },
    { message: '정액 할인인 경우 금액을 입력해주세요', path: ['amount'] }
  )
  .refine(
    (data) => {
      // DISCOUNT + PERCENT이면 percent 필수
      if (data.benefitType === 'DISCOUNT' && data.type === 'PERCENT') {
        return data.percent !== undefined && data.percent !== null;
      }
      return true;
    },
    { message: '정률 할인인 경우 할인율을 입력해주세요', path: ['percent'] }
  )
  .refine(
    (data) => {
      // DURATION이면 durationMonths 필수
      if (data.benefitType === 'DURATION') {
        return data.durationMonths !== undefined && data.durationMonths !== null;
      }
      return true;
    },
    { message: '기간 쿠폰은 개월 수를 입력해주세요', path: ['durationMonths'] }
  )
  .refine(
    (data) => {
      // DURATION이면 target은 MONTHLY_PASS만 허용
      if (data.benefitType === 'DURATION') {
        return data.target === 'MONTHLY_PASS';
      }
      return true;
    },
    { message: '기간 쿠폰은 Pro 1개월 이용권에만 적용 가능합니다', path: ['target'] }
  );

export type CreateTossCouponRequest = z.infer<typeof createTossCouponRequestSchema>;

// 토스페이먼츠 쿠폰 생성 응답 데이터 스키마
export const createTossCouponResponseDataSchema = z.object({
  id: z.number(),
  code: z.string()
});

// 토스페이먼츠 쿠폰 생성 응답 스키마 (백엔드 래핑)
export const createTossCouponResponseSchema = z.object({
  data: createTossCouponResponseDataSchema,
  error: z.null().optional()
});

export type CreateTossCouponResponse = z.infer<typeof createTossCouponResponseSchema>;
export type CreateTossCouponResponseData = z.infer<typeof createTossCouponResponseDataSchema>;
