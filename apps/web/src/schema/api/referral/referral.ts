import { z } from 'zod';

// --- 초대 현황 조회 ---

const referralRewardSchema = z.object({
  tier: z.number().int(),
  threshold: z.number().int(),
  rewardMonths: z.number().int(),
  achieved: z.boolean(),
  grantedAt: z.string().nullish()
});

export const getReferralMeResponseSchema = z
  .object({
    data: z.object({
      referralCode: z.string(),
      successCount: z.number().int(),
      refundedCount: z.number().int(),
      effectiveCount: z.number().int(),
      rewards: z.array(referralRewardSchema),
      eventEndsAt: z.string(),
      isEventActive: z.boolean()
    })
  })
  .transform(({ data }) => data);

export type GetReferralMeResponse = z.infer<typeof getReferralMeResponseSchema>;

// --- ref 코드 유효성 검증 ---

export const referralInvalidReasonSchema = z.enum([
  'SELF_REFERRAL',
  'EVENT_ENDED',
  'NOT_FOUND',
  'ALREADY_CONVERTED',
  'INVALID_FORMAT'
]);

export type ReferralInvalidReason = z.infer<typeof referralInvalidReasonSchema>;

export const getReferralValidateResponseSchema = z
  .object({
    data: z.object({
      valid: z.boolean(),
      reason: referralInvalidReasonSchema.nullish(),
      referrerDisplayName: z.string().nullish()
    })
  })
  .transform(({ data }) => data);

export type GetReferralValidateResponse = z.infer<
  typeof getReferralValidateResponseSchema
>;
