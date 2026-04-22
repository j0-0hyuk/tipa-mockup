import { authenticatedApi } from '@/api/instance';
import { HTTPError } from 'ky';
import {
  type GetAllPaymentHistoryRequest,
  getAllPaymentHistoryRequestSchema,
  getAllPaymentHistoryResponseSchema,
  getReceiptResponseSchema,
  type PostPaymentEventRequest,
  PostPaymentEventRequestSchema
} from '@/schema/api/payments/payments.ts';

export const postPaymentEvent = async (params: PostPaymentEventRequest) => {
  const schema = PostPaymentEventRequestSchema.parse(params);
  return await authenticatedApi.post('payment', { json: schema }).json();
};

export const getReceipt = async (paymentHistoryId: number) => {
  const response = await authenticatedApi
    .get(`payment/${paymentHistoryId}/receipt`)
    .json();

  return getReceiptResponseSchema.parse(response);
};

export const getAllPaymentHistory = async (
  params: GetAllPaymentHistoryRequest
) => {
  const { page, size, filter } =
    getAllPaymentHistoryRequestSchema.parse(params);
  const response = await authenticatedApi
    .get('payment/history', {
      searchParams: { page, size, ...(filter ? { filter } : {}) }
    })
    .json();

  return getAllPaymentHistoryResponseSchema.parse(response);
};

export const postPaymentDocsCoupon = async (coupon: string) => {
  try {
    await authenticatedApi.post('payment/local-coupon', { json: { coupon } });
    return true;
  } catch (error) {
    if (error instanceof HTTPError && error.response.status === 400) {
      return false;
    }
    throw error;
  }
};
