import { z } from 'zod';

// Enum schemas
export const accountRoleSchema = z.enum([
  'FREE',
  'SUB',
  'MONTHLY_PASS',
  'SEASON_PASS',
  'ADMIN'
]);

export const subscriptionTypeSchema = z.enum([
  'SUBSCRIPTION_M',
  'SUBSCRIPTION_Y',
  'MONTHLY_PASS',
  'SEASON_PASS'
]);

export const subscriptionStatusSchema = z.enum([
  'ACTIVE',
  'SCHEDULED',
  'EXPIRED'
]);

export const paymentEventTypeSchema = z.enum([
  'SUBSCRIPTION_PURCHASED',
  'MONTHLY_PASS_PURCHASED',
  'SEASON_PASS_PURCHASED'
]);

export const paymentItemTypeSchema = z.enum([
  'SUBSCRIPTION_M',
  'SUBSCRIPTION_Y',
  'MONTHLY_PASS',
  'SEASON_PASS'
]);

export const paymentCurrencySchema = z.enum(['USD', 'KRW']);

export const paymentProviderSchema = z.enum(['TOSS', 'PADDLE']);
export const paymentCancelStatusSchema = z.enum(['PARTIAL', 'FULL']);

// Sub-schemas
export const generationResultSchema = z.object({
  pending: z.number(),
  progress: z.number(),
  completed: z.number(),
  failed: z.number(),
  total: z.number()
});

export const subscriptionInfoSchema = z.object({
  subscriptionId: z.number(),
  type: subscriptionTypeSchema,
  startsAt: z.string(),
  endsAt: z.string(),
  paddleSubscriptionId: z.string().nullable(),
  status: subscriptionStatusSchema
});

export const paymentHistorySchema = z.object({
  paymentHistoryId: z.number(),
  subscriptionId: z.number().nullable(),
  eventType: paymentEventTypeSchema,
  itemType: paymentItemTypeSchema,
  totalPrice: z.number().nullable(),
  currency: paymentCurrencySchema.nullable(),
  paidAt: z.string().nullable(),
  createdAt: z.string(),
  paymentKey: z.string().nullable().optional(),
  cancelStatus: paymentCancelStatusSchema.nullable().optional(),
  cancelledAmount: z.number().nullable().optional(),
  paymentProvider: paymentProviderSchema.nullable().optional()
});

export const usageSchema = z.object({
  freeCredit: z.number(),
  paidCredit: z.number(),
  totalRemainingCredit: z.number().optional().default(0),
  failedFileGenerationCount: z.number().optional().default(0),
  failedExportFileGenerationCount: z.number().optional().default(0),
  failedProductGenerationCount: z.number().optional().default(0),
  fileGenerationResult: generationResultSchema.optional(),
  productGenerationResult: generationResultSchema.optional(),
  overallGenerationResult: generationResultSchema.optional()
});

// Response schema
export const getSubscriptionUsageResponseSchema = z
  .object({
    data: z.object({
      accountId: z.number(),
      email: z.string(),
      name: z.string().nullable(),
      role: accountRoleSchema,
      hasProAccess: z.boolean().optional(),
      subscription: subscriptionInfoSchema.nullable(),
      subscriptions: z.array(subscriptionInfoSchema),
      paymentHistories: z.array(paymentHistorySchema),
      usage: usageSchema
    })
  })
  .transform(({ data }) => data);

export type GetSubscriptionUsageResponse = z.infer<
  typeof getSubscriptionUsageResponseSchema
>;

// Request schemas
export const updateSubscriptionRequestSchema = z
  .object({
    role: accountRoleSchema.optional(),
    endsAt: z.string().optional(),
    subscriptionId: z.number().optional()
  })
  .refine(
    (data) =>
      data.role !== undefined ||
      data.endsAt !== undefined ||
      data.subscriptionId !== undefined,
    { message: '최소 1개 이상의 필드를 입력해야 합니다.' }
  );

export type UpdateSubscriptionRequest = z.infer<
  typeof updateSubscriptionRequestSchema
>;

export const createSubscriptionTypeSchema = z.enum([
  'MONTHLY_PASS',
  'SEASON_PASS'
]);

export const createSubscriptionRequestSchema = z.object({
  type: createSubscriptionTypeSchema,
  startsAt: z.string(),
  endsAt: z.string()
});

export type CreateSubscriptionRequest = z.infer<
  typeof createSubscriptionRequestSchema
>;
