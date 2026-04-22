import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getReferralMeQueryOptions } from '@/query/options/referral';
import {
  StyledPageContainer,
  StyledTabLink,
  StyledTabContainer,
  StyledTabIndicator
} from '@/routes/_authenticated/credit-plan/-components/CreditPlan.style';
import { ReferralEvent } from '@/routes/_authenticated/referral-event/-components/ReferralEvent';
import { Flex } from '@docs-front/ui';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { useI18n } from '@/hooks/useI18n';

export const Route = createFileRoute('/_authenticated/referral-event')({
  component: RouteComponent
});

function RouteComponent() {
  const { isMobile } = useBreakPoints();
  const { t } = useI18n(['referralEvent']);

  const { data, isLoading } = useQuery(getReferralMeQueryOptions());

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
              <StyledTabLink $isActive={false}>내 플랜</StyledTabLink>
            </Link>
            <Link to="/credit-policy">
              <StyledTabLink $isActive={false}>플랜 이용 안내</StyledTabLink>
            </Link>
            <Link to="/referral-event">
              <StyledTabLink $isActive={true}>
                {t('referralEvent:tab')} <StyledTabIndicator />
              </StyledTabLink>
            </Link>
          </StyledTabContainer>
          <ReferralEvent data={data} isLoading={isLoading} />
        </Flex>
      </StyledPageContainer>
    </Flex>
  );
}
