import { authenticatedApi } from '@/api/authenticated/instance';
import {
  getAccountResponseSchema,
  getAllAccountsResponseSchema,
  type GetAllAccountsRequest,
  type UpdateAccountCreditRequest
} from '@/schema/api/accounts/accounts';
import { getMyAccountResponseSchema } from '@/schema/api/accounts/accounts.ts';
import {
  getSubscriptionUsageResponseSchema,
  type UpdateSubscriptionRequest,
  type CreateSubscriptionRequest
} from '@/schema/api/accounts/subscription';
import {
  getAccountFilesResponseSchema,
  getAccountProductsResponseSchema
} from '@/schema/api/accounts/usage-detail';

export const getMyAccount = async () => {
  const response = await authenticatedApi.get('me').json();

  return getMyAccountResponseSchema.parse(response);
};

export const getAccountByEmail = async (email: string) => {
  const response = await authenticatedApi
    .get('admin/accounts', {
      searchParams: { email }
    })
    .json<{ data: unknown; error: unknown }>();

  return getAccountResponseSchema.parse(response.data);
};

export const updateAccountCredit = async (
  params: UpdateAccountCreditRequest
) => {
  return await authenticatedApi
    .patch('admin/accounts', { json: params })
    .json();
};

export const getAccountSubscriptionUsage = async (accountId: number) => {
  const response = await authenticatedApi
    .get(`admin/accounts/${accountId}/subscription`)
    .json();

  return getSubscriptionUsageResponseSchema.parse(response);
};

export const updateAccountSubscription = async (
  accountId: number,
  params: UpdateSubscriptionRequest
) => {
  return await authenticatedApi
    .patch(`admin/accounts/${accountId}/subscription`, { json: params })
    .json();
};

export const createAccountSubscription = async (
  accountId: number,
  params: CreateSubscriptionRequest
) => {
  return await authenticatedApi
    .post(`admin/accounts/${accountId}/subscription`, { json: params })
    .json();
};

export const getAccountFiles = async (
  accountId: number,
  params: { page?: number; size?: number; fileType?: string }
) => {
  const searchParams: Record<string, string | number> = {
    page: params.page ?? 0,
    size: params.size ?? 10
  };

  if (params.fileType && params.fileType !== 'ALL') {
    searchParams.fileType = params.fileType;
  }

  const response = await authenticatedApi
    .get(`admin/accounts/${accountId}/products/files`, { searchParams })
    .json();

  return getAccountFilesResponseSchema.parse(response);
};

export const getAccountProducts = async (
  accountId: number,
  params: { page?: number; size?: number }
) => {
  const response = await authenticatedApi
    .get(`admin/accounts/${accountId}/products`, {
      searchParams: {
        page: params.page ?? 0,
        size: params.size ?? 10
      }
    })
    .json();

  return getAccountProductsResponseSchema.parse(response);
};

export const getAllAccounts = async (params: GetAllAccountsRequest) => {
  const searchParams: Record<string, string | number> = {
    page: params.page,
    size: params.size
  };

  if (params.email) {
    searchParams.email = params.email;
  }

  if (params.sort) {
    searchParams.sort = params.sort;
  }

  if (params.direction) {
    searchParams.direction = params.direction;
  }

  const response = await authenticatedApi
    .get('admin/accounts/page', { searchParams })
    .json();

  return getAllAccountsResponseSchema.parse(response);
};
