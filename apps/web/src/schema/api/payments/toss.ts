import { z } from 'zod';

// 결제 승인 요청 스키마
export const postTossPaymentConfirmRequestSchema = z.object({
  paymentKey: z.string(),
  orderId: z.string(),
  amount: z.number().int().nonnegative() // 100원 미만 무료 결제 시 0일 수 있음
});

export type PostTossPaymentConfirmRequest = z.infer<
  typeof postTossPaymentConfirmRequestSchema
>;

// 결제 승인 데이터 스키마 (백엔드에서 반환하는 필드)
export const tossPaymentDataSchema = z.object({
  paymentKey: z.string(),
  orderId: z.string(),
  orderName: z.string(),
  status: z.string(),
  totalAmount: z.number(),
  method: z.string().nullish(),
  approvedAt: z.string().nullish(),
  // 추가 필드들은 optional
  currency: z.string().optional(),
  mId: z.string().optional(),
  version: z.string().optional()
});

export type TossPaymentData = z.infer<typeof tossPaymentDataSchema>;

// 결제 승인 내부 응답 스키마
export const tossPaymentConfirmInnerResponseSchema = z.object({
  success: z.boolean(),
  data: tossPaymentDataSchema.nullish(),
  error: z
    .object({
      code: z.string(),
      message: z.string()
    })
    .nullish()
});

// 결제 승인 API 응답 (백엔드 래핑)
export const postTossPaymentConfirmResponseSchema = z.object({
  data: tossPaymentConfirmInnerResponseSchema,
  error: z
    .object({
      code: z.string(),
      message: z.string()
    })
    .nullish()
});

export type PostTossPaymentConfirmResponse = z.infer<
  typeof postTossPaymentConfirmResponseSchema
>;

// 토스페이먼츠 상품 타입 (Paddle 레거시와 구분)
// - MONTHLY_PASS: Pro 1개월 이용권
// - SEASON_PASS: Master 2026
export const tossItemTypeSchema = z.enum(['MONTHLY_PASS', 'SEASON_PASS']);

export type TossItemType = z.infer<typeof tossItemTypeSchema>;

// 주문 생성 요청 스키마
export const postTossOrderRequestSchema = z.object({
  itemType: tossItemTypeSchema,
  amount: z.number().int().positive(),
  couponCode: z.string().optional(), // 쿠폰 코드 (선택)
  referralCode: z.string().optional(), // 친구 초대 코드 (선택)
  currency: z.enum(['KRW', 'USD']).default('KRW')
});

export type PostTossOrderRequest = z.infer<typeof postTossOrderRequestSchema>;

// 주문 데이터 스키마
export const tossOrderDataSchema = z.object({
  orderId: z.string(),
  itemType: tossItemTypeSchema,
  orderName: z.string(),
  amount: z.number(), // 할인 적용된 최종 금액
  originalAmount: z.number().optional(), // 정가 (할인 전 금액)
  discountAmount: z.number().optional(), // 할인 금액
  currency: z.string(),
  customerKey: z.string(),
  requiresPayment: z.boolean().optional(), // true: 토스 결제창 필요, false: 100원 미만으로 바로 confirm 호출
  appliedDiscountType: z.enum(['COUPON', 'REFERRAL', 'NONE']).optional() // 레퍼럴/쿠폰 충돌 시 실제 적용된 할인 유형
});

export type TossOrderData = z.infer<typeof tossOrderDataSchema>;

// 주문 생성 응답 스키마 (백엔드 래핑)
export const postTossOrderResponseSchema = z.object({
  data: tossOrderDataSchema,
  error: z
    .object({
      code: z.string(),
      message: z.string()
    })
    .nullish()
});

export type PostTossOrderResponse = z.infer<typeof postTossOrderResponseSchema>;

// 토스페이먼츠 에러 스키마
export const tossPaymentErrorSchema = z.object({
  code: z.string(),
  message: z.string()
});

export type TossPaymentError = z.infer<typeof tossPaymentErrorSchema>;
