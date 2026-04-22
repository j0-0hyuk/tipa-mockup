import { authenticatedApi } from '@/api/instance';
import {
  type PostTossOrderRequest,
  postTossOrderRequestSchema,
  postTossOrderResponseSchema,
  type PostTossPaymentConfirmRequest,
  postTossPaymentConfirmRequestSchema,
  postTossPaymentConfirmResponseSchema
} from '@/schema/api/payments/toss';

/**
 * 토스페이먼츠 결제를 위한 주문 생성
 * - orderId, customerKey 등 결제에 필요한 정보를 백엔드에서 생성
 */
export const postTossOrder = async (params: PostTossOrderRequest) => {
  const schema = postTossOrderRequestSchema.parse(params);
  const response = await authenticatedApi
    .post('payment/toss/order', { json: schema })
    .json();

  return postTossOrderResponseSchema.parse(response);
};

/**
 * 토스페이먼츠 결제 승인
 * - successUrl로 리다이렉트 후 호출
 * - 백엔드에서 토스페이먼츠 API를 호출하여 결제 승인 처리
 */
export const postTossPaymentConfirm = async (
  params: PostTossPaymentConfirmRequest
) => {
  const schema = postTossPaymentConfirmRequestSchema.parse(params);
  const response = await authenticatedApi
    .post('payment/toss/confirm', { json: schema })
    .json();

  return postTossPaymentConfirmResponseSchema.parse(response);
};

/**
 * 토스페이먼츠 결제 취소 (필요시 구현)
 */
export const postTossPaymentCancel = async (params: {
  paymentKey: string;
  cancelReason: string;
  cancelAmount?: number;
}) => {
  const response = await authenticatedApi
    .post('payment/toss/cancel', { json: params })
    .json();

  return response;
};
