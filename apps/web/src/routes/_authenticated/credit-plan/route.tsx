import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { getPaymentHistoryQueryOptions } from '@/query/options/payments';
import { getSubscriptionQueryOptions } from '@/query/options/subscription';
import {
  StyledPageContainer,
  StyledTabLink,
  StyledTabContainer,
  StyledTabIndicator
} from '@/routes/_authenticated/credit-plan/-components/CreditPlan.style';
import { CreditPlan } from '@/routes/_authenticated/credit-plan/-components/CreditPlan';
import { Flex } from '@docs-front/ui';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { useI18n } from '@/hooks/useI18n';
import { PricingPlanModal } from '@/routes/_authenticated/credit-plan/-components/PricingPlanModal/PricingPlanModal';
import { useState, useEffect } from 'react';

interface CreditPlanSearch {
  pricing?: boolean;
}

export const Route = createFileRoute('/_authenticated/credit-plan')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): CreditPlanSearch => ({
    pricing: search.pricing === true || search.pricing === 'true'
  })
});

function RouteComponent() {
  const { pricing } = Route.useSearch();
  const navigate = useNavigate();
  const { data: accountData } = useQuery(getAccountMeQueryOptions());
  const { isMobile } = useBreakPoints();
  const { t } = useI18n(['referralEvent']);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  // Paddle이 초기화될 때까지 기다린 후 모달 열기
  useEffect(() => {
    if (!pricing) {
      setIsPricingModalOpen(false);
      return;
    }

    // Paddle 초기화 확인 및 대기
    const checkPaddleAndOpen = () => {
      if (typeof window !== 'undefined' && window.Paddle) {
        setIsPricingModalOpen(true);
        return true;
      }
      return false;
    };

    // 즉시 확인
    if (checkPaddleAndOpen()) return;

    // Paddle이 준비될 때까지 폴링 (최대 3초)
    let attempts = 0;
    const maxAttempts = 30;
    const interval = setInterval(() => {
      attempts++;
      if (checkPaddleAndOpen() || attempts >= maxAttempts) {
        clearInterval(interval);
        // 최대 시도 후에도 없으면 그냥 열기 (fallback 가격으로)
        if (attempts >= maxAttempts) {
          setIsPricingModalOpen(true);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [pricing]);

  const handlePricingModalChange = (open: boolean) => {
    setIsPricingModalOpen(open);
    if (!open) {
      // 모달이 닫힐 때 URL에서 pricing 파라미터 제거
      navigate({ to: '/credit-plan', search: {}, replace: true });
    }
  };

  const { data: subscriptionData, isLoading: isSubscriptionLoading } = useQuery(
    getSubscriptionQueryOptions()
  );

  const {
    data: paymentHistoryData,
    isLoading: isPaymentHistoryLoading,
    error: paymentHistoryError
  } = useQuery(getPaymentHistoryQueryOptions());

  const paymentHistory =
    paymentHistoryData?.data?.paymentHistoryPage?.content?.map((payment) => ({
      ...payment,
      payedAt: payment.payedAt ?? undefined,
      nextPaidAt: payment.nextPaidAt ?? undefined
    })) || [];
  const subscription = subscriptionData?.data
    ? {
        ...subscriptionData.data,
        item: subscriptionData.data.item,
        endsAt:
          subscriptionData.data.scheduledCancelsAt ??
          subscriptionData.data.endsAt ??
          undefined,
        changeToAtEnds: subscriptionData.data.scheduledCancelsAt
          ? 'CANCELED'
          : subscriptionData.data.changeToAtEnds
      }
    : null;
  const isFreePlan = !subscription;
  return (
    <Flex
      semantic="main"
      height="100vh"
      width="100%"
      margin="0 auto"
      direction="column"
    >
      <StyledPageContainer $isMobile={isMobile}>
        <Flex direction="column" alignItems="center" width="100%">
          <StyledTabContainer $isMobile={isMobile}>
            <Link to="/credit-plan">
              <StyledTabLink $isActive={true}>
                내 플랜 <StyledTabIndicator />
              </StyledTabLink>
            </Link>
            <Link to="/credit-policy">
              <StyledTabLink $isActive={false}>플랜 이용 안내</StyledTabLink>
            </Link>
            <Link to="/referral-event">
              <StyledTabLink $isActive={false}>
                {t('referralEvent:tab')}
              </StyledTabLink>
            </Link>
          </StyledTabContainer>
          <CreditPlan
            accountData={accountData}
            subscription={subscription}
            isFreePlan={isFreePlan}
            isSubscriptionLoading={isSubscriptionLoading}
            paymentHistory={paymentHistory}
            isPaymentHistoryLoading={isPaymentHistoryLoading}
            paymentHistoryError={paymentHistoryError as Error | null}
          />
        </Flex>
      </StyledPageContainer>

      {/* URL 파라미터로 모달 자동 열기 */}
      <PricingPlanModal
        open={isPricingModalOpen}
        onOpenChange={handlePricingModalChange}
      />
    </Flex>
  );
}
