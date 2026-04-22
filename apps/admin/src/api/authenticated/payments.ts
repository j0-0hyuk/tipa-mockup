import {
  listPricesResponseSchema,
  type ListPricesResponse
} from '@/schema/api/payments/listPrices';
import {
  cancelPaymentResponseSchema,
  type CancelPaymentRequest,
  type CancelPaymentResponseData
} from '@/schema/api/payments/cancelPayment';
import { authenticatedApi } from '@/api/authenticated/instance';

export const listPrices = async (): Promise<ListPricesResponse> => {
  const response = await authenticatedApi.get('admin/payment/prices').json();
  return listPricesResponseSchema.parse(response);
};

export const cancelPayment = async (
  request: CancelPaymentRequest
): Promise<CancelPaymentResponseData> => {
  const response = await authenticatedApi
    .post('admin/payment/toss/cancel', { json: request })
    .json();
  return cancelPaymentResponseSchema.parse(response);
};
