import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getSubscriptionQueryOptions } from '@/query/options/subscription';
import { usePaddle } from '@/hooks/usePaddle';
import type { BillingCycle } from '@/constants/pricingTier.constant';

const mapSubscriptionItemToPricingTier = (
  item: 'SUBSCRIPTION_M' | 'SUBSCRIPTION_Y' | 'SEASON_PASS'
): { tierId: 'pro'; billingCycle: BillingCycle } => {
  if (item === 'SUBSCRIPTION_M') {
    return { tierId: 'pro', billingCycle: 'month' };
  }
  return { tierId: 'pro', billingCycle: 'year' };
};

export type NextBillingInfo = {
  amount: number;
  formattedAmount: string;
  currencyCode: 'KRW' | 'USD';
  billingCycle: BillingCycle;
} | null;

export const usePaddlePayment = (paddleCustomerId?: string | null) => {
  const { data: subscription } = useQuery(getSubscriptionQueryOptions());
  const { getItem } = usePaddle('subscription');

  const getNextBillingInfo = useCallback(async (): Promise<NextBillingInfo> => {
    if (!subscription?.data) {
      return null;
    }

    const { item } = subscription.data;
    const { billingCycle } = mapSubscriptionItemToPricingTier(item);

    try {
      const priceInfo = await getItem('pro', billingCycle);
      if (!priceInfo) {
        return null;
      }

      return {
        amount: priceInfo.perMonthAmount,
        formattedAmount: priceInfo.formattedPerMonth,
        currencyCode: priceInfo.currencyCode,
        billingCycle
      };
    } catch (error) {
      console.error('결제 정보 조회 실패:', error);
      return null;
    }
  }, [subscription, getItem]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['nextBillingAmount', subscription?.data?.id, paddleCustomerId],
    queryFn: getNextBillingInfo,
    enabled: !!subscription?.data
  });

  return {
    nextBillingInfo: data,
    isLoading,
    error
  };
};
