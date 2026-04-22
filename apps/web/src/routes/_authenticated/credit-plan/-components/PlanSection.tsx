import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PricingPlanModal } from '@/routes/_authenticated/credit-plan/-components/PricingPlanModal/PricingPlanModal';
import { patchRenewSubscription } from '@/api/subscription';
import { type PricingTierId } from '@/constants/pricingTier.constant.ts';
import {
  StyledSection,
  StyledSectionTitle,
  StyledPlanCard,
  StyledPlanTitle,
  StyledPlanButton,
  StyledFeatureList,
  StyledFeatureItem,
  StyledCheckIcon,
  StyledFeatureText,
  StyledPlanMeta,
  StyledNextBilling,
  StyledSubscriptionButton
} from '@/routes/_authenticated/credit-plan/-components/CreditPlan.style';
import { useI18n } from '@/hooks/useI18n.ts';
import { usePaddle } from '@/hooks/usePaddle.ts';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { Flex } from '@docs-front/ui';
import { useMemo } from 'react';

interface PlanSectionProps {
  subscription:
    | {
        item: string;
        endsAt: string | undefined;
        changeToAtEnds: string;
      }
    | null
    | undefined;
  isFreePlan: boolean;
  isSubscriptionLoading: boolean;
}

export const PlanSection = ({
  subscription,
  isFreePlan,
  isSubscriptionLoading
}: PlanSectionProps) => {
  const { t, currentLanguage } = useI18n(['creditPlan']);
  const { isMobile, sm } = useBreakPoints();
  const queryClient = useQueryClient();
  const currentLocale = currentLanguage === 'ko' ? 'ko-KR' : 'en-US';
  const { pricingTiers } = usePaddle('subscription');
  // const { data: me } = useSuspenseQuery(getAccountMeQueryOptions());

  // const isSubscribe = me.paddleCustomerId;
  // const { nextBillingInfo } = usePaddlePayment(me.paddleCustomerId);
  const isSeasonPass = subscription?.item === 'SEASON_PASS';
  const isMonthlyPass = subscription?.item === 'MONTHLY_PASS';

  const currentPlanId: PricingTierId = useMemo(() => {
    if (isFreePlan) return 'starter';
    if (subscription?.item === 'SEASON_PASS') return 'seasonPass';
    if (
      subscription?.item === 'SUBSCRIPTION_M' ||
      subscription?.item === 'SUBSCRIPTION_Y' ||
      subscription?.item === 'MONTHLY_PASS'
    )
      return 'pro';
    return 'starter';
  }, [isFreePlan, subscription?.item]);

  const currentPlanTitle = useMemo(() => {
    if (isSubscriptionLoading) return t('creditPlan:loading');
    if (isFreePlan) return t('creditPlan:planNames.starter');
    if (isSeasonPass) return t('creditPlan:planNames.seasonPass');
    if (subscription?.item === 'MONTHLY_PASS')
      return t('creditPlan:planNames.proMonthly');
    if (subscription?.item === 'SUBSCRIPTION_M')
      return t('creditPlan:planNames.proMonthly');
    if (subscription?.item === 'SUBSCRIPTION_Y')
      return t('creditPlan:planNames.proYearly');
    return t('creditPlan:planNames.starter');
  }, [isSubscriptionLoading, isFreePlan, isSeasonPass, subscription?.item, t]);

  const currentPlanFeatures = useMemo(() => {
    return (
      pricingTiers.find((tier) => tier.id === currentPlanId)?.features || []
    );
  }, [currentPlanId, pricingTiers]);

  const isScheduledSubscriptionChange =
    !!subscription?.changeToAtEnds &&
    !!subscription.endsAt &&
    subscription?.changeToAtEnds !== subscription?.item &&
    subscription?.changeToAtEnds !== 'CANCELED' &&
    subscription?.changeToAtEnds !== 'MONTHLY_PASS_EXPIRED' &&
    subscription?.changeToAtEnds !== 'SEASON_PASS_EXPIRED';

  const billingInfo = useMemo(() => {
    if (isFreePlan) return null;
    // MONTHLY_PASS는 만료일만 표시
    if (isMonthlyPass && subscription?.endsAt) {
      return {
        label: t('creditPlan:planExpiryDate'),
        date: subscription.endsAt
      };
    }
    if (isScheduledSubscriptionChange) {
      return {
        label: t('creditPlan:planChangeDate', {
          date: subscription?.endsAt
            ? new Date(subscription.endsAt).toLocaleDateString(currentLocale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            : '',
          plan:
            subscription.changeToAtEnds === 'SUBSCRIPTION_M'
              ? t('creditPlan:shortPlanNames.proMonthly')
              : subscription.changeToAtEnds === 'SUBSCRIPTION_Y'
                ? t('creditPlan:shortPlanNames.proYearly')
                : t('creditPlan:shortPlanNames.starter')
        }),
        date: subscription.endsAt
      };
    } else if (
      subscription?.endsAt &&
      subscription?.changeToAtEnds !== 'CANCELED' &&
      subscription?.changeToAtEnds !== 'MONTHLY_PASS_EXPIRED'
    ) {
      return {
        label: t('creditPlan:nextBilling'),
        date: subscription.endsAt
      };
    } else if (
      subscription?.endsAt &&
      (subscription?.changeToAtEnds === 'CANCELED' || subscription?.changeToAtEnds === 'MONTHLY_PASS_EXPIRED')
    ) {
      return {
        label: t('creditPlan:planExpiryDate'),
        date: subscription.endsAt
      };
    }
    return null;
  }, [isFreePlan, isMonthlyPass, isScheduledSubscriptionChange, subscription?.endsAt, subscription?.changeToAtEnds, t, currentLocale]);

  const isActiveSubscription = !!subscription;
  const showRenewButton =
    isActiveSubscription && subscription?.changeToAtEnds === 'CANCELED';

  const { mutate: renewSubscription, isPending: isRenewing } = useMutation({
    mutationFn: patchRenewSubscription,
    onSuccess: () => {
      alert(t('creditPlan:renewSuccess'));
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      window.location.reload();
    }
  });

  const handleRenewSubscription = () => {
    if (isRenewing) return;
    if (confirm(t('creditPlan:renewConfirm'))) {
      renewSubscription();
    }
  };

  return (
    <StyledSection $isMobile={isMobile}>
      <StyledSectionTitle>{t('creditPlan:myPlan')}</StyledSectionTitle>

      <StyledPlanCard $isSm={sm}>
        <StyledPlanTitle $isSm={sm}>{currentPlanTitle}</StyledPlanTitle>
        {!isSeasonPass && (
          <PricingPlanModal>
            <StyledPlanButton $isSm={sm}>
              {t('creditPlan:upgradeButton')}
            </StyledPlanButton>
          </PricingPlanModal>
        )}
      </StyledPlanCard>

      <Flex
        justify="space-between"
        width="100%"
        direction={sm ? 'column' : 'row'}
        alignItems={'flex-start'}
        gap={sm ? 16 : 0}
      >
        <StyledFeatureList>
          {isSubscriptionLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <StyledFeatureItem key={index}>
                  <StyledCheckIcon>✓</StyledCheckIcon>
                  <StyledFeatureText>
                    {t('creditPlan:loading')}
                  </StyledFeatureText>
                </StyledFeatureItem>
              ))
            : currentPlanFeatures.map((feature: string, index: number) => (
                <StyledFeatureItem key={index}>
                  <StyledCheckIcon>✓</StyledCheckIcon>
                  <StyledFeatureText>{feature}</StyledFeatureText>
                </StyledFeatureItem>
              ))}
        </StyledFeatureList>

        <StyledPlanMeta $isSm={sm}>
          {isSeasonPass ? (
            <StyledNextBilling $isSm={sm}>
              {t('creditPlan:planExpiryDate')}:{' '}
              {subscription?.endsAt
                ? new Date(subscription.endsAt).toLocaleDateString(
                    currentLocale,
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }
                  )
                : ''}
            </StyledNextBilling>
          ) : (
            <>
              {billingInfo &&
                (isScheduledSubscriptionChange ? (
                  <StyledNextBilling $isSm={sm}>
                    {billingInfo.label}
                  </StyledNextBilling>
                ) : (
                  <StyledNextBilling $isSm={sm}>
                    {billingInfo.label}:{' '}
                    {billingInfo.date
                      ? new Date(billingInfo.date).toLocaleDateString(
                          currentLocale,
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }
                        )
                      : ''}
                  </StyledNextBilling>
                ))}
              {/* {isSubscribe && nextBillingInfo && (
                <StyledNextBilling $isSm={sm}>
                  예정 결제 금액: {nextBillingInfo.formattedAmount}
                </StyledNextBilling>
              )} */}
            </>
          )}
          {showRenewButton && (
            <StyledSubscriptionButton
              $isSm={sm}
              onClick={handleRenewSubscription}
              disabled={isRenewing}
              aria-busy={isRenewing}
            >
              {t('creditPlan:renewSubscription')}
            </StyledSubscriptionButton>
          )}
        </StyledPlanMeta>
      </Flex>
    </StyledSection>
  );
};
