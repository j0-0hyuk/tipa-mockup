import { authenticatedApi } from '@/api/instance';
import {
  getReferralMeResponseSchema,
  getReferralValidateResponseSchema
} from '@/schema/api/referral/referral';

export const getReferralMe = async () => {
  const response = await authenticatedApi.get('referral/me').json();
  return getReferralMeResponseSchema.parse(response);
};

export const getReferralValidate = async (code: string) => {
  const response = await authenticatedApi
    .get('referral/validate', { searchParams: { code } })
    .json();
  return getReferralValidateResponseSchema.parse(response);
};
