import { z } from 'zod';

export const patchChangeSubscriptionRequestSchema = z.object({
  type: z.enum(['SUBSCRIPTION_M', 'SUBSCRIPTION_Y']),
  immediately: z.boolean()
});

export type PatchChangeSubscriptionRequestParams = z.input<
  typeof patchChangeSubscriptionRequestSchema
>;
