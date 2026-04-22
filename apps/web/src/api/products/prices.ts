import { authenticatedApi } from '@/api/instance';
import {
  getProductPricesResponseSchema,
  type GetProductPricesResponse
} from '@/schema/api/products/prices';

/**
 * 상품 가격 정보 조회
 * - 토스페이먼츠 결제에 사용되는 상품 가격/이름 정보
 * - PricingPlanCard, TossPaymentModal 등에서 사용
 */
export const getProductPrices = async (): Promise<GetProductPricesResponse> => {
  const response = await authenticatedApi.get('payment/toss/prices').json();
  return getProductPricesResponseSchema.parse(response);
};
