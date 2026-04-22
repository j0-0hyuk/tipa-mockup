import { authenticatedApi } from '@/api/instance';
import {
  getMyAccountResponseSchema,
  type GetMyAccountResponse,
  type UpdateAccountRequest
} from '@/schema/api/accounts/accounts';

const PROTOTYPE_ACCOUNT_STUB: GetMyAccountResponse = {
  id: 1,
  provider: 'prototype',
  email: 'prototype@example.com',
  name: '프로토타입 사용자',
  language: 'ko',
  role: 'SUB',
  freeCredit: 999,
  paidCredit: 999,
  paddleCustomerId: null,
  createdAt: new Date().toISOString(),
  termsConsents: [],
  hasProAccess: true,
  productCreationCredit: 999,
  productExportCredit: 999,
  hasLowCreditProductProcess: false,
  theme: null
};

export const getMyAccount = async (): Promise<GetMyAccountResponse> => {
  if (import.meta.env.VITE_IS_PROTOTYPE === 'true') {
    return PROTOTYPE_ACCOUNT_STUB;
  }
  const response = await authenticatedApi.get('me').json();

  return getMyAccountResponseSchema.parse(response);
};

export const updateAccount = async (params: UpdateAccountRequest) => {
  return await authenticatedApi.patch('account', { json: params }).json();
};
