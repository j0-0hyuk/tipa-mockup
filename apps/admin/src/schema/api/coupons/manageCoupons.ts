import { z } from 'zod';
import {
  tossCouponBenefitTypeSchema,
  tossCouponStatusSchema,
  tossCouponTargetSchema,
  tossCouponTypeSchema
} from '@/schema/api/coupons/createTossCoupon';

export const adminCouponTypeSchema = z.enum(['TOSS', 'LOCAL']);
export type AdminCouponType = z.infer<typeof adminCouponTypeSchema>;

export const getCouponsRequestSchema = z.object({
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(100).default(30),
  type: adminCouponTypeSchema.optional(),
  status: tossCouponStatusSchema.optional(),
  code: z.string().optional()
});

export type GetCouponsRequest = z.infer<typeof getCouponsRequestSchema>;

export const couponListItemSchema = z
  .object({
    id: z.number(),
    type: adminCouponTypeSchema,
    code: z.string(),
    description: z.string().nullish(),
    benefitType: tossCouponBenefitTypeSchema.optional().nullable(),
    discountType: tossCouponTypeSchema.optional().nullable(),
    amount: z.number().optional().nullable(),
    percent: z.number().optional().nullable(),
    durationMonths: z.number().optional().nullable(),
    credit: z.number().optional().nullable(),
    target: tossCouponTargetSchema.optional().nullable(),
    status: tossCouponStatusSchema,
    usedCount: z.number().default(0),
    maxUses: z.number().optional().nullable(),
    startsAt: z.string().optional().nullable(),
    endsAt: z.string().optional().nullable(),
    createdAt: z.string().optional().nullable(),
    updatedAt: z.string().optional().nullable()
  })
  .passthrough();

export type CouponListItem = z.infer<typeof couponListItemSchema>;

export const couponPageSchema = z.object({
  content: z.array(couponListItemSchema),
  totalElements: z.number(),
  totalPages: z.number(),
  size: z.number(),
  number: z.number(),
  first: z.boolean().optional(),
  last: z.boolean().optional()
});

export const getCouponsResponseSchema = z.object({
  data: z.object({
    couponPage: couponPageSchema
  })
});

export type GetCouponsResponse = z.infer<typeof getCouponsResponseSchema>;
export type GetCouponsResponseData = GetCouponsResponse['data'];

const nullableDateStringSchema = z.string().nullable();

export const editCouponFormSchema = z
  .object({
    description: z.string().max(500, '설명은 500자 이하여야 합니다').optional(),
    status: tossCouponStatusSchema,
    startsAt: nullableDateStringSchema,
    endsAt: nullableDateStringSchema,
    maxUses: z
      .number()
      .int('최대 사용 횟수는 정수여야 합니다')
      .min(1, '최대 사용 횟수는 1 이상이어야 합니다')
      .nullable()
      .optional(),
    amount: z
      .number()
      .int('할인 금액은 정수여야 합니다')
      .min(1, '할인 금액은 1원 이상이어야 합니다')
      .nullable()
      .optional(),
    percent: z
      .number()
      .min(1, '할인율은 1% 이상이어야 합니다')
      .max(100, '할인율은 100% 이하여야 합니다')
      .nullable()
      .optional(),
    durationMonths: z
      .number()
      .int('기간은 정수여야 합니다')
      .min(1, '기간은 1개월 이상이어야 합니다')
      .nullable()
      .optional(),
    credit: z
      .number()
      .int('크레딧은 정수여야 합니다')
      .min(1, '크레딧은 1 이상이어야 합니다')
      .nullable()
      .optional()
  })
  .refine(
    (data) => {
      if (!data.startsAt || !data.endsAt) {
        return true;
      }

      return new Date(data.startsAt).getTime() <= new Date(data.endsAt).getTime();
    },
    {
      message: '종료일은 시작일보다 빠를 수 없습니다',
      path: ['endsAt']
    }
  );

export type EditCouponFormData = z.infer<typeof editCouponFormSchema>;

export const updateCouponRequestSchema = z.object({
  description: z.string().max(500).optional(),
  status: tossCouponStatusSchema.optional(),
  startsAt: z.string().optional().nullable(),
  endsAt: z.string().optional().nullable(),
  maxUses: z.number().int().min(1).optional().nullable(),
  amount: z.number().int().min(1).optional().nullable(),
  percent: z.number().min(1).max(100).optional().nullable(),
  durationMonths: z.number().int().min(1).optional().nullable(),
  credit: z.number().int().min(1).optional().nullable()
});

export type UpdateCouponRequest = z.infer<typeof updateCouponRequestSchema>;
