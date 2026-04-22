import { useQuery } from '@tanstack/react-query';
import { getProductPricesQueryOptions } from '@/query/options/products';
import { useI18n } from '@/hooks/useI18n';
import type { ProductKey, ProductPrice } from '@/schema/api/products/prices';

/**
 * 가격 포맷팅 함수
 * @param price 가격 (정수)
 * @param currency 통화 코드
 * @returns 포맷팅된 가격 문자열 (예: "190,000원", "$129")
 */
export const formatPrice = (
  price: number,
  currency: 'KRW' | 'USD' = 'KRW'
): string => {
  if (currency === 'KRW') {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

/** 포맷팅된 가격이 포함된 상품 정보 */
export type ProductWithDisplayPrice = ProductPrice & {
  price: number;
  currency: 'KRW' | 'USD';
  displayPrice: string;
};

/**
 * 상품 가격 정보 조회 훅
 *
 * @example
 * ```tsx
 * const { products, getProduct, isLoading } = useProductPrices();
 *
 * // 전체 상품 정보
 * console.log(products?.MONTHLY_PASS.name); // "Pro 1개월 이용권"
 *
 * // 특정 상품 정보 (현재 언어에 맞는 가격 포함)
 * const monthlyPass = getProduct('MONTHLY_PASS');
 * console.log(monthlyPass?.displayPrice); // "190,000원" (ko) or "$129" (en)
 * console.log(monthlyPass?.price); // 190000 (ko) or 129 (en)
 * ```
 */
export const useProductPrices = () => {
  const { currentLanguage } = useI18n([]);
  const { data, isLoading, error } = useQuery(getProductPricesQueryOptions());

  const products = data?.data;

  /**
   * 특정 상품 정보 조회 (현재 언어에 맞는 가격 포함)
   */
  const getProduct = (key: ProductKey): ProductWithDisplayPrice | undefined => {
    if (!products) return undefined;

    const product = products[key];
    const isKorean = currentLanguage === 'ko';
    const price = isKorean ? product.krw : product.usd;
    const currency = isKorean ? 'KRW' : 'USD';

    return {
      ...product,
      price,
      currency,
      displayPrice: formatPrice(price, currency)
    };
  };

  return {
    products,
    getProduct,
    isLoading,
    error
  };
};
