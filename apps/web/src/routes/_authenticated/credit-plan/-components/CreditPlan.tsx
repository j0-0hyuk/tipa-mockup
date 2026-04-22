import { CreditSection } from '@/routes/_authenticated/credit-plan/-components/CreditSection';
import { PlanSection } from '@/routes/_authenticated/credit-plan/-components/PlanSection';
import { PaymentHistorySection } from '@/routes/_authenticated/credit-plan/-components/PaymentHistorySection';
import {
  StyledPageTitle,
  StyledContentContainer
} from '@/routes/_authenticated/credit-plan/-components/CreditPlan.style';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { Flex } from '@docs-front/ui';
import DailyLimitSection from '@/routes/_authenticated/credit-plan/-components/DailyLimitSection';

interface PaymentHistoryItem {
  id: number;
  eventType: string;
  itemType: string;
  totalPrice: number;
  currency: string;
  payedAt?: string;
  nextPaidAt?: string;
  createdAt: string;
}

interface CreditPlanProps {
  accountData:
    | {
        freeCredit: number;
        paidCredit: number;
      }
    | undefined;
  subscription: {
    item: string;
    endsAt: string | undefined;
    changeToAtEnds: string;
  } | null;
  isFreePlan: boolean;
  isSubscriptionLoading: boolean;
  paymentHistory: PaymentHistoryItem[];
  isPaymentHistoryLoading: boolean;
  paymentHistoryError: Error | null;
}

export const CreditPlan = ({
  accountData,
  subscription,
  isFreePlan,
  isSubscriptionLoading,
  paymentHistory,
  isPaymentHistoryLoading,
  paymentHistoryError
}: CreditPlanProps) => {
  const { isMobile } = useBreakPoints();
  const hasPaidCredit = (accountData?.paidCredit ?? 0) > 0;
  return (
    <StyledContentContainer $isMobile={isMobile}>
      <StyledPageTitle $isMobile={isMobile}>내 플랜 </StyledPageTitle>

      <Flex direction="column" gap="60px" width="100%">
        <PlanSection
          subscription={subscription}
          isFreePlan={isFreePlan}
          isSubscriptionLoading={isSubscriptionLoading}
        />

        {hasPaidCredit && <CreditSection accountData={accountData} />}

        {!isFreePlan && <DailyLimitSection />}

        <PaymentHistorySection
          subscription={subscription}
          paymentHistory={paymentHistory}
          isLoading={isPaymentHistoryLoading}
          error={paymentHistoryError}
        />
      </Flex>
    </StyledContentContainer>
  );
};
