import { Suspense, useMemo, useState, type ChangeEvent } from 'react';
import {
  StyledPricingPlanCard,
  StyledPricingPlanCardBackground,
  StyledPricingPlanCardCheckbox,
  StyledPricingPlanCardHeaderSection,
  StyledPricingPlanCardPriceUnitText,
  StyledPricingPlanCardPriceValueText,
  StyledPricingPlanCardTitle,
  StyledPricingPlanRecommendedBadge,
  StyledPricingPlanCardOffText,
  StyledCouponText,
  StyledSeasonPassBadge,
  StyledSeasonPassPrice,
  StyledSeasonPassPriceUnit,
  StyledSeasonPassDescription
} from '@/routes/_authenticated/credit-plan/-components/PricingPlanModal/PricingPlanModal.style';
import { Check } from 'lucide-react';
import { useTheme } from '@emotion/react';
import { Button, Flex, useToast } from '@docs-front/ui';
import { usePaddle } from '@/hooks/usePaddle.ts';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { getSubscriptionQueryOptions } from '@/query/options/subscription';
import { postPaymentDocsCoupon } from '@/api/payments';
import { getPaymentHistoryQueryOptions } from '@/query/options/payments';
import { useI18n } from '@/hooks/useI18n.ts';
import type { PricingTier } from '@/constants/pricingTier.constant.ts';
import { Input } from '@docs-front/ui';
import { Coupon } from '@docs-front/ui';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { useProductPrices } from '@/hooks/useProductPrices';
import { TossPaymentModal } from '@/routes/_authenticated/credit-plan/-components/TossPaymentModal';


interface PricingPlanCardProps {
  tier: { features: string[] } & PricingTier;
  billingCycle: 'month' | 'year';
  onClose?: () => void;
  onChangeSubscription?: (params: {
    tier: PricingTier;
    billingCycle: 'month' | 'year';
  }) => void;
}

export const PricingPlanCard = ({
  tier,
  billingCycle,
  onClose,
  onChangeSubscription
}: PricingPlanCardProps) => {
  switch (tier.id) {
    case 'pro':
      return (
        <ProCard
          tier={tier}
          billingCycle={billingCycle}
          onClose={onClose}
          onChangeSubscription={onChangeSubscription}
          isDiscount={false}
        />
      );
    case 'seasonPass':
      return <SeasonPassCard tier={tier} onClose={onClose} />;
    case 'starter':
      return (
        <StarterCard
          tier={tier}
          billingCycle={billingCycle}
          onClose={onClose}
          onChangeSubscription={onChangeSubscription}
        />
      );
    default:
      return (
        <StarterCard
          tier={tier}
          billingCycle={billingCycle}
          onClose={onClose}
          onChangeSubscription={onChangeSubscription}
        />
      );
  }
};

interface Discountable {
  isDiscount?: boolean;
  originPrices?: { month: number; year: number };
}

const PriceDisplay = ({
  tier,
  isDiscount
}: {
  tier: PricingPlanCardProps['tier'];
} & Discountable) => {
  const theme = useTheme();
  const { t } = useI18n(['pricing']);
  const { sm } = useBreakPoints();
  if (!isDiscount) {
    return (
      <Flex alignItems="flex-end" height={54.5}>
        <StyledPricingPlanCardPriceValueText
          color={theme.color.black}
          $isMobile={sm}
        >
          <Suspense
            fallback={<PriceFallbackText />}
          >
            <PricingPlanCardPrice tier={tier} />
          </Suspense>
        </StyledPricingPlanCardPriceValueText>
        <StyledPricingPlanCardPriceUnitText>
          {t('pricing:ui.card.perMonth')}
        </StyledPricingPlanCardPriceUnitText>
      </Flex>
    );
  } else
    return (
      <Flex alignItems="flex-end" height={48} gap={8}>
        <StyledPricingPlanCardPriceValueText
          color={theme.color.main}
          style={{ height: '48px' }}
          $isMobile={sm}
        >
          <Suspense fallback={<PriceFallbackText />}>
            <StyledPricingPlanCardOffText>
              <PricingPlanCardOriginalPrice />
            </StyledPricingPlanCardOffText>
            <PricingPlanCardPrice tier={tier} />
          </Suspense>
        </StyledPricingPlanCardPriceValueText>
        <StyledPricingPlanCardPriceUnitText>
          {t('pricing:ui.card.perMonth')}
        </StyledPricingPlanCardPriceUnitText>
      </Flex>
    );
};

export const CouponDisplay = ({
  value,
  onChange,
  onApply,
  disabled,
  inputDisabled,
  isLoading
}: {
  value: string;
  onChange: (v: string) => void;
  onApply: () => void;
  disabled?: boolean;
  inputDisabled?: boolean;
  isLoading?: boolean;
}) => {
  const { t } = useI18n(['pricing']);

  return (
    <Flex alignItems="start" direction="column" gap={8}>
      <StyledCouponText>
        <Coupon />
        {t('pricing:ui.card.haveCouponCode')}
      </StyledCouponText>
      <Flex alignItems="center" gap={8}>
        <Input
          placeholder={t('pricing:ui.card.enterCouponCode')}
          style={{ fontSize: 15 }}
          disabled={inputDisabled}
          width={'100%'}
          height={40}
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e?.target?.value ?? '')
          }
        />
        <Button
          variant="filled"
          size="medium"
          disabled={disabled || !value?.trim() || isLoading}
          onClick={onApply}
          style={{
            whiteSpace: 'nowrap'
          }}
        >
          {t('pricing:ui.card.getStartedWithDiscount')}
        </Button>
      </Flex>
    </Flex>
  );
};

const ProCard = ({
  tier,
  billingCycle,
  onClose,
  onChangeSubscription,
  isDiscount,
  originPrices
}: PricingPlanCardProps & Discountable) => {
  const { openCheckout } = usePaddle('subscription');
  const toast = useToast();
  const [coupon, setCoupon] = useState<string>('');
  const [isTossModalOpen, setIsTossModalOpen] = useState(false);
  const { sm } = useBreakPoints();
  const queryClient = useQueryClient();
  const { data: account } = useQuery(getAccountMeQueryOptions());
  const { open } = useToast();
  const { t } = useI18n(['pricing']);
  const theme = useTheme();

  // 상품 가격 정보 (MONTHLY_PASS)
  const { getProduct } = useProductPrices();
  const monthlyPassProduct = getProduct('MONTHLY_PASS');

  // Paddle 결제 (레거시 - 현재 미사용)
  const checkoutMutation = useMutation({
    mutationFn: async ({ discountCode }: { discountCode?: string }) => {
      const options = discountCode?.trim()
        ? { discountCode: discountCode.trim() }
        : undefined;
      openCheckout(tier.id, billingCycle, undefined, options);
    },
    onError: (error: Error) => {
      toast.open({ content: error.message, duration: 3000 });
    },
    onSettled: () => {
      onClose?.();
    }
  });

  const couponMutation = useMutation({
    mutationFn: (couponCode: string) => postPaymentDocsCoupon(couponCode),
    onSuccess: async (isSuccess) => {
      if (isSuccess) {
        await queryClient.invalidateQueries(getAccountMeQueryOptions());
        await queryClient.invalidateQueries(getPaymentHistoryQueryOptions());
        await open({ content: '쿠폰이 적용되었습니다.', duration: 3000 });
        onClose?.();
      } else {
        // 쿠폰이 아닌 경우 결제 진행
        handleCheckout();
      }
    },
    onError: (error) => {
      console.error('❌ Failed to apply coupon:', error);
      handleCheckout();
    }
  });

  const isCurrentPlan = () => {
    if (!account) return false;
    if (tier.id === 'starter' && account.role === 'FREE') return true;
    // MONTHLY_PASS는 일회성 Pro 1개월 플랜
    if (tier.id === 'pro' && account.role === 'MONTHLY_PASS') return true;
    // SUB는 구독 기반 Pro 플랜 (기존 Paddle 고객)
    if (tier.id === 'pro' && account.role === 'SUB') return true;
    return false;
  };

  const isDisabled = () => {
    if (!account) return false;
    if (isCurrentPlan()) return true;
    if (tier.id === 'starter' && (account.role === 'SUB' || account.role === 'MONTHLY_PASS')) return true;
    return false;
  };

  const isInputDisabled = () => {
    if (!account) return false;
    if (tier.id === 'pro' && isCurrentPlan()) return true;
    return false;
  };

  const handleApplyCoupon = () => {
    if (isDisabled() || checkoutMutation.isPending || couponMutation.isPending)
      return;
    const code = coupon.trim();
    if (!code) return;
    couponMutation.mutate(code);
  };

  const handleCheckout = () => {
    setIsTossModalOpen(true);
  };

  const handleTossModalClose = (open: boolean) => {
    setIsTossModalOpen(open);
  };

  return (
    <>
      <StyledPricingPlanCard
        borderColor={theme.color.borderGray}
        borderWidth="1px"
        isRecommended={false}
        $isSm={sm}
      >
        <StyledPricingPlanCardBackground background={theme.color.white}>
          <Flex direction="column" gap={12} alignSelf="stretch">
            <StyledPricingPlanCardHeaderSection>
              <PricingPlanCardHeader tier={tier} showBadge={false} />
              <PriceDisplay
                isDiscount={isDiscount}
                originPrices={originPrices}
                tier={tier}
              />
            </StyledPricingPlanCardHeaderSection>

            <Flex
              direction="column"
              gap={12}
              alignSelf="stretch"
              padding="0px 24px 24px 24px"
            >
              <CouponDisplay
                value={coupon}
                onChange={setCoupon}
                onApply={handleApplyCoupon}
                disabled={
                  isDisabled() ||
                  checkoutMutation.isPending ||
                  couponMutation.isPending
                }
                inputDisabled={
                  isInputDisabled() ||
                  checkoutMutation.isPending ||
                  couponMutation.isPending
                }
                isLoading={couponMutation.isPending}
              />
              <PricingPlanCardButton
                tier={tier}
                billingCycle={billingCycle}
                onChangeSubscription={onChangeSubscription}
                onCheckout={() => handleCheckout()}
                isProcessing={
                  checkoutMutation.isPending || couponMutation.isPending
                }
              />
              <StyledSeasonPassDescription>
                {t('pricing:pro.description')}
              </StyledSeasonPassDescription>
              <PricingPlanCardFeatures features={tier.features} />
            </Flex>
          </Flex>
        </StyledPricingPlanCardBackground>
      </StyledPricingPlanCard>

      {/* 토스페이먼츠 결제 모달 */}
      {monthlyPassProduct && (
        <TossPaymentModal
          open={isTossModalOpen}
          onOpenChange={handleTossModalClose}
          product={monthlyPassProduct}
          couponCode={coupon}
        />
      )}
    </>
  );
};

const SeasonPassCard = ({
  tier,
  onClose
}: Omit<PricingPlanCardProps, 'onChangeSubscription' | 'billingCycle'>) => {
  const { openCheckout } = usePaddle('seasonPass');
  const toast = useToast();
  const [coupon, setCoupon] = useState<string>('');
  const [isTossModalOpen, setIsTossModalOpen] = useState(false);
  const { sm, isMobile } = useBreakPoints();
  const queryClient = useQueryClient();
  const { t } = useI18n(['pricing']);
  const { open } = useToast();

  // 상품 가격 정보 (SEASON_PASS)
  const { getProduct } = useProductPrices();
  const seasonPassProduct = getProduct('SEASON_PASS');
  const theme = useTheme();

  // Paddle 결제 (레거시 - 현재 미사용)
  const checkoutMutation = useMutation({
    mutationFn: async ({ discountCode }: { discountCode?: string }) => {
      const options = discountCode?.trim()
        ? { discountCode: discountCode.trim() }
        : undefined;
      openCheckout(tier.id, 'month', undefined, options);
    },
    onError: (error: Error) => {
      toast.open({ content: error.message, duration: 3000 });
    },
    onSettled: () => {
      onClose?.();
    }
  });

  const couponMutation = useMutation({
    mutationFn: (couponCode: string) => postPaymentDocsCoupon(couponCode),
    onSuccess: async (isSuccess) => {
      if (isSuccess) {
        await queryClient.invalidateQueries(getAccountMeQueryOptions());
        await queryClient.invalidateQueries(getPaymentHistoryQueryOptions());
        await open({ content: '쿠폰이 적용되었습니다.', duration: 3000 });
        onClose?.();
      } else {
        handleCheckout();
      }
    },
    onError: (error) => {
      console.error('❌ Failed to apply coupon:', error);
      handleCheckout();
    }
  });

  const handleApplyCoupon = () => {
    if (checkoutMutation.isPending || couponMutation.isPending) return;
    const code = coupon.trim();
    if (!code) return;
    couponMutation.mutate(code);
  };

  const handleCheckout = () => {
    setIsTossModalOpen(true);
  };

  const handleTossModalClose = (open: boolean) => {
    setIsTossModalOpen(open);
  };

  const features = t('pricing:seasonPass.features', {
    returnObjects: true
  }) as string[];

  return (
    <>
      <StyledPricingPlanCard
        borderColor={theme.color.main}
        borderWidth="1px"
        isRecommended={false}
        $isSm={sm}
      >
        <StyledPricingPlanCardBackground background={theme.color.white}>
          <Flex
            direction="column"
            gap={12}
            alignSelf="stretch"
            style={{ borderRadius: '16px' }}
          >
            <StyledPricingPlanCardHeaderSection
              $backgroundColor={theme.color.bgMain}
            >
              <Flex
                height={22}
                alignItems="center"
                gap={8}
                alignSelf="stretch"
                style={{ borderRadius: '16px' }}
              >
                <StyledPricingPlanCardTitle>
                  {t('pricing:seasonPass.name')}
                </StyledPricingPlanCardTitle>
                <StyledSeasonPassBadge>
                  {t('pricing:seasonPass.badge')}
                </StyledSeasonPassBadge>
              </Flex>

              <Flex direction="row" alignItems="end">
                <Flex alignItems="flex-end" gap={2}>
                  <StyledSeasonPassPrice $isMobile={isMobile}>
                    <Suspense fallback={<SeasonPassPriceFallback />}>
                      <SeasonPassPriceDisplay />
                    </Suspense>
                  </StyledSeasonPassPrice>
                  <StyledSeasonPassPriceUnit>
                    {t('pricing:seasonPass.priceUnit')}
                  </StyledSeasonPassPriceUnit>
                </Flex>
              </Flex>
            </StyledPricingPlanCardHeaderSection>

            <Flex
              direction="column"
              gap={12}
              alignSelf="stretch"
              padding="0px 24px 24px 24px"
            >
              <CouponDisplay
                value={coupon}
                onChange={setCoupon}
                onApply={handleApplyCoupon}
                disabled={checkoutMutation.isPending || couponMutation.isPending}
                inputDisabled={
                  checkoutMutation.isPending || couponMutation.isPending
                }
                isLoading={couponMutation.isPending}
              />

              <Button
                variant="filled"
                size="medium"
                width="100%"
                disabled={checkoutMutation.isPending || couponMutation.isPending}
                style={{
                  opacity:
                    checkoutMutation.isPending || couponMutation.isPending
                      ? 0.5
                      : 1,
                  cursor:
                    checkoutMutation.isPending || couponMutation.isPending
                      ? 'not-allowed'
                      : 'pointer',
                  boxSizing: 'border-box'
                }}
                onClick={() => handleCheckout()}
              >
                {t('pricing:seasonPass.buttonText')}
              </Button>

              <StyledSeasonPassDescription>
                {t('pricing:seasonPass.description')}
              </StyledSeasonPassDescription>

              <PricingPlanCardFeatures features={features} />
            </Flex>
          </Flex>
        </StyledPricingPlanCardBackground>
      </StyledPricingPlanCard>

      {/* 토스페이먼츠 결제 모달 (시즌패스) */}
      {seasonPassProduct && (
        <TossPaymentModal
          open={isTossModalOpen}
          onOpenChange={handleTossModalClose}
          product={seasonPassProduct}
          couponCode={coupon}
        />
      )}
    </>
  );
};

const SeasonPassPriceDisplay = () => {
  const { getProduct } = useProductPrices();
  const seasonPassProduct = getProduct('SEASON_PASS');
  return <>{seasonPassProduct?.displayPrice ?? '-'}</>;
};

const SeasonPassPriceFallback = () => {
  return <>-</>;
};

const StarterCard = ({
  tier,
  billingCycle,
  onClose,
  onChangeSubscription
}: PricingPlanCardProps) => {
  const theme = useTheme();
  const { sm } = useBreakPoints();
  const { openCheckout } = usePaddle('subscription');
  const toast = useToast();

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      openCheckout(tier.id, billingCycle);
    },
    onError: (error: Error) => {
      toast.open({ content: error.message, duration: 3000 });
    },
    onSettled: () => {
      onClose?.();
    }
  });

  return (
    <StyledPricingPlanCard
      borderColor={theme.color.borderGray}
      borderWidth="1px"
      isRecommended={false}
      $isSm={sm}
    >
      <StyledPricingPlanCardBackground background={theme.color.white}>
        <Flex direction="column" gap={12} alignSelf="stretch">
          <StyledPricingPlanCardHeaderSection>
            <PricingPlanCardHeader tier={tier} />
            <Flex alignItems="flex-end">
              <StyledPricingPlanCardPriceValueText color={theme.color.black}>
                <Suspense fallback={<PriceFallbackText />}>
                  <PricingPlanCardPrice tier={tier} />
                </Suspense>
              </StyledPricingPlanCardPriceValueText>
            </Flex>
          </StyledPricingPlanCardHeaderSection>

          <Flex
            direction="column"
            gap={12}
            alignSelf="stretch"
            padding="0px 24px 24px 24px"
          >
            <PricingPlanCardButton
              tier={tier}
              billingCycle={billingCycle}
              onChangeSubscription={onChangeSubscription}
              onCheckout={() => checkoutMutation.mutate()}
              isProcessing={checkoutMutation.isPending}
            />
            <PricingPlanCardFeatures features={tier.features} />
          </Flex>
        </Flex>
      </StyledPricingPlanCardBackground>
    </StyledPricingPlanCard>
  );
};

const PricingPlanCardHeader = ({
  tier,
  showBadge = true
}: {
  tier: PricingPlanCardProps['tier'];
  showBadge?: boolean;
}) => {
  const { t } = useI18n(['pricing']);

  return (
    <Flex height={22} alignItems="center" gap={4} alignSelf="stretch">
      <StyledPricingPlanCardTitle>{tier.name}</StyledPricingPlanCardTitle>
      {tier.id === 'pro' && showBadge && (
        <StyledPricingPlanRecommendedBadge>
          {t('pricing:ui.card.recommended')}
        </StyledPricingPlanRecommendedBadge>
      )}
    </Flex>
  );
};

const PricingPlanCardButton = ({
  tier,
  billingCycle,
  onChangeSubscription,
  onCheckout,
  isProcessing
}: {
  tier: PricingPlanCardProps['tier'];
  billingCycle: PricingPlanCardProps['billingCycle'];
  onChangeSubscription?: PricingPlanCardProps['onChangeSubscription'];
  onCheckout?: () => void;
  isProcessing?: boolean;
}) => {
  const { t } = useI18n(['pricing']);
  const theme = useTheme();

  const { data: account } = useQuery(getAccountMeQueryOptions());

  const { data: subscription } = useQuery({
    ...getSubscriptionQueryOptions(),
    enabled: !!account && account.role === 'SUB'
  });

  const isCurrentPlan = () => {
    if (!account) return false;
    if (tier.id === 'starter' && account.role === 'FREE') return true;
    // MONTHLY_PASS는 일회성 Pro 1개월 플랜
    if (tier.id === 'pro' && account.role === 'MONTHLY_PASS') return true;
    // SUB는 구독 기반 Pro 플랜 (기존 Paddle 고객)
    if (tier.id === 'pro' && account.role === 'SUB') return true;
    return false;
  };

  const isDisabled = () => {
    if (!account) return false;
    if (isCurrentPlan()) return true;
    if (tier.id === 'starter' && (account.role === 'SUB' || account.role === 'MONTHLY_PASS')) return true;
    return false;
  };

  const handleClick = () => {
    if (isDisabled() || isProcessing) return;

    // SUB 사용자만 구독 변경 가능 (MONTHLY_PASS는 일회성이므로 변경 불가)
    if (tier.id === 'pro' && account?.role === 'SUB' && subscription?.data) {
      const currentBillingCycle =
        subscription.data.item === 'SUBSCRIPTION_M' ? 'month' : 'year';
      if (currentBillingCycle !== billingCycle) {
        onChangeSubscription?.({ tier, billingCycle });
        return;
      }
    }

    onCheckout?.();
  };

  const getButtonText = () => {
    if (isCurrentPlan()) return t('pricing:ui.card.currentPlan');
    if (tier.id === 'pro') return t('pricing:pro.buttonText');
    return t('pricing:ui.card.getStarted');
  };

  return (
    <Button
      variant={tier.id === 'pro' ? 'filled' : 'outlined'}
      size="medium"
      width="100%"
      disabled={isDisabled() || !!isProcessing}
      style={{
        boxSizing: 'border-box',
        backgroundColor: theme.color.bgBlueGray,
        color: theme.color.black
      }}
      onClick={handleClick}
    >
      {getButtonText()}
    </Button>
  );
};

const PricingPlanCardFeatures = ({ features }: { features: string[] }) => {
  const theme = useTheme();

  return (
    <Flex padding="8px 0" direction="column" gap={12} alignSelf="stretch">
      {Array.isArray(features) &&
        features.map((feature) => (
          <Flex key={feature} alignItems="center" gap={12}>
            <StyledPricingPlanCardCheckbox>
              <Check size={16} color={theme.color.bgDarkGray} />
            </StyledPricingPlanCardCheckbox>
            <p style={{ whiteSpace: 'pre-wrap' }}>{feature}</p>
          </Flex>
        ))}
    </Flex>
  );
};

const PricingPlanCardPrice = ({
  tier
}: {
  tier: PricingPlanCardProps['tier'];
}) => {
  const { t } = useI18n(['pricing']);
  const { getProduct } = useProductPrices();
  const monthlyPassProduct = getProduct('MONTHLY_PASS');
  const seasonPassProduct = getProduct('SEASON_PASS');

  return useMemo(() => {
    if (tier.id === 'starter') {
      return t('pricing:ui.price.free');
    }
    if (tier.id === 'seasonPass') {
      return seasonPassProduct?.displayPrice ?? '';
    }
    return monthlyPassProduct?.displayPrice ?? '';
  }, [
    tier.id,
    t,
    monthlyPassProduct?.displayPrice,
    seasonPassProduct?.displayPrice
  ]);
};

const PricingPlanCardOriginalPrice = () => {
  const { getProduct } = useProductPrices();
  const monthlyPassProduct = getProduct('MONTHLY_PASS');
  return monthlyPassProduct?.displayPrice ?? '';
};

const PriceFallbackText = () => {
  return <>-</>;
};
