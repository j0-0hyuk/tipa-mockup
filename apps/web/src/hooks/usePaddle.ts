import { useCallback, useMemo } from 'react';
import TagManager from 'react-gtm-module';
import {
  type BillingCycle,
  type OpenCheckoutOptions,
  PRICING_TIERS,
  type PricingTier,
  type PricingTierId
} from '@/constants/pricingTier.constant';
import { useQuery } from '@tanstack/react-query';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { useI18n } from '@/hooks/useI18n.ts';
import { getSubscriptionQueryOptions } from '@/query/options/subscription';

type PlanType = 'subscription' | 'seasonPass';

const mapSubscriptionItemToPricingTier = (
  item: 'SUBSCRIPTION_M' | 'SUBSCRIPTION_Y' | 'SEASON_PASS'
): { tierId: PricingTierId; billingCycle: BillingCycle } => {
  if (item === 'SUBSCRIPTION_M') {
    return { tierId: 'pro', billingCycle: 'month' };
  }
  return { tierId: 'pro', billingCycle: 'year' };
};

type CurrencyKey = 'KRW' | 'USD';

type FallbackPrice = {
  currencyCode: CurrencyKey;
  perMonthAmount: number;
  formattedPerMonth: string;
};

const FALLBACK_PER_MONTH_PRICE: Record<
  CurrencyKey,
  Record<BillingCycle, number>
> = {
  KRW: { month: 49000, year: 42000 },
  USD: { month: 49, year: 42 }
};

const resolveCurrencyKey = (
  currencyHint?: string,
  language?: string
): CurrencyKey => {
  if (currencyHint === 'KRW') return 'KRW';
  if (!currencyHint && language === 'ko') return 'KRW';
  return 'USD';
};

const formatLocalizedPrice = (currencyCode: CurrencyKey, amount: number) => {
  if (currencyCode === 'KRW') {
    const formattedNumber = new Intl.NumberFormat('ko-KR', {
      maximumFractionDigits: 0
    }).format(Math.round(amount));
    return `${formattedNumber}원`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const getPriceId = (
  id: PricingTierId,
  billingCycle: BillingCycle,
  plan: PlanType
): string | undefined => {
  const tier = PRICING_TIERS.find((tier) => tier.id === id);
  const priceId = tier?.priceId;
  if (!priceId) return undefined;

  const isSubscriptionPlan = plan === 'subscription';
  const isPriceIdObject = typeof priceId === 'object';

  if (isSubscriptionPlan) {
    return isPriceIdObject ? priceId[billingCycle] : undefined;
  } else return isPriceIdObject ? priceId[billingCycle] : priceId;
};

export const usePaddle = (plan: PlanType) => {
  const { data: account } = useQuery(getAccountMeQueryOptions());

  const { data: subscription } = useQuery(getSubscriptionQueryOptions());

  const { t, currentLanguage } = useI18n(['pricing']);

  const pricingTiers = useMemo<
    ({ description: string; features: string[] } & PricingTier)[]
  >(() => {
    return PRICING_TIERS.map((tier) => {
      const tierId = tier.id;
      const translationKey = `pricing:${tierId}`;

      return {
        ...tier,
        name: t(`${translationKey}.name`, ''),
        description: t(`${translationKey}.description`, ''),
        features: t(`${translationKey}.features`, '', {
          returnObjects: true
        }) as unknown as string[]
      };
    });
  }, [t]);

  const getFallbackPrice = useCallback(
    (billingCycle: BillingCycle, currencyHint?: string): FallbackPrice => {
      const currencyCode = resolveCurrencyKey(currencyHint, currentLanguage);
      const perMonthAmount =
        FALLBACK_PER_MONTH_PRICE[currencyCode][billingCycle];

      return {
        currencyCode,
        perMonthAmount,
        formattedPerMonth: formatLocalizedPrice(currencyCode, perMonthAmount)
      };
    },
    [currentLanguage]
  );

  const openCheckout = useCallback(
    (
      id: PricingTierId,
      billingCycle: BillingCycle,
      customData?: Record<string, unknown>,
      options?: OpenCheckoutOptions
    ) => {
      if (typeof window === 'undefined' || !window.Paddle || !account) return;

      const priceId = getPriceId(id, billingCycle, plan);
      if (!priceId) return;

      // 구독 상품인 경우 중복 구독 검증
      if (plan === 'subscription' && subscription?.data) {
        const currentSubscription = mapSubscriptionItemToPricingTier(
          subscription.data.item
        );

        if (
          currentSubscription.tierId === id &&
          currentSubscription.billingCycle === billingCycle
        ) {
          throw new Error('이미 동일한 구독을 보유하고 있습니다.');
        }
      }

      const discountCode = options?.discountCode?.trim();
      const checkoutData = {
        items: [{ priceId, quantity: 1 }],
        customData: { account_id: account.id, ...customData },
        customer: { email: account.email },
        ...(discountCode && { discountCode })
      };

      if (import.meta.env.VITE_ENVIRONMENT === 'prod') {
        TagManager.dataLayer({
          dataLayer: { event: 'begin_checkout', plan_name: id, billing_cycle: billingCycle }
        });
      }
      window.Paddle.Checkout.open(checkoutData);
    },
    [plan, account, subscription]
  );

  const getItem = useCallback(
    async (id: PricingTierId, billingCycle: BillingCycle) => {
      const priceId = getPriceId(id, billingCycle, plan);
      const paddle = typeof window === 'undefined' ? undefined : window.Paddle;

      if (!paddle || !priceId) {
        const fallback = getFallbackPrice(billingCycle);
        return {
          countryCode: fallback.currencyCode,
          currencyCode: fallback.currencyCode,
          perMonthAmount: fallback.perMonthAmount,
          formattedPerMonth: fallback.formattedPerMonth,
          fallback,
          item: null
        };
      }

      try {
        const { data } = await paddle.PricePreview({
          items: [
            {
              priceId,
              quantity: 1
            }
          ]
        });

        const rawCurrencyCode = data.currencyCode;
        const currencyCode =
          rawCurrencyCode === 'KRW' ? 'KRW' : ('USD' as CurrencyKey);
        const countryCode =
          (data as { countryCode?: string }).countryCode ?? currencyCode;

        const lineItem = data.details.lineItems[0];
        const totalMinor = Number(lineItem?.totals?.total ?? 0);
        const perMonthMinor =
          billingCycle === 'month' ? totalMinor : totalMinor / 12;
        const decimals = currencyCode === 'KRW' ? 0 : 2;
        const perMonthAmount = perMonthMinor / 10 ** decimals;
        const formattedPerMonth = formatLocalizedPrice(
          currencyCode,
          perMonthAmount
        );
        const fallback = getFallbackPrice(billingCycle, currencyCode);

        return {
          countryCode,
          currencyCode,
          perMonthAmount,
          formattedPerMonth,
          fallback,
          item: lineItem
        };
      } catch (error) {
        console.error(
          '❌ Paddle PricePreview 실패, fallback 가격 사용:',
          error
        );
        const fallback = getFallbackPrice(billingCycle);
        return {
          countryCode: fallback.currencyCode,
          currencyCode: fallback.currencyCode,
          perMonthAmount: fallback.perMonthAmount,
          formattedPerMonth: fallback.formattedPerMonth,
          fallback,
          item: null
        };
      }
    },
    [plan, getFallbackPrice]
  );

  return { openCheckout, getItem, getFallbackPrice, pricingTiers };
};
