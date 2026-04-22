import { authenticatedApi } from '@/api/instance';
import { getSubscriptionResponseSchema } from '@/schema/api/payments/payments.ts';
import {
  type PatchChangeSubscriptionRequestParams,
  patchChangeSubscriptionRequestSchema
} from '@/schema/api/subscription/subscription.ts';

export const getSubscription = async () => {
  const response = await authenticatedApi.get(`subscription`).json();

  return getSubscriptionResponseSchema.parse(response);
};

export const patchCancelSubscription = async () => {
  return await authenticatedApi.patch('subscription/cancel').json();
};

export const patchRenewSubscription = async () => {
  return await authenticatedApi.patch('subscription/renew').json();
};

export const patchChangeSubscription = async (
  params: PatchChangeSubscriptionRequestParams
) => {
  const { type, immediately } =
    patchChangeSubscriptionRequestSchema.parse(params);

  return await authenticatedApi
    .patch('subscription', { json: { type, immediately } })
    .json();
};
