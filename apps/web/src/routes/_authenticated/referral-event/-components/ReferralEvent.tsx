import { Flex, Spinner } from '@docs-front/ui';
import { useI18n } from '@/hooks/useI18n';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import type { GetReferralMeResponse } from '@/schema/api/referral/referral';
import { ReferralLinkSection } from '@/routes/_authenticated/referral-event/-components/ReferralLinkSection';
import { ProgressSection } from '@/routes/_authenticated/referral-event/-components/ProgressSection';
import { EventInfoSection } from '@/routes/_authenticated/referral-event/-components/EventInfoSection';
import {
  StyledContentContainer,
  StyledPageTitle
} from '@/routes/_authenticated/credit-plan/-components/CreditPlan.style';
import {
  StyledEventHeader,
  StyledEventPeriod,
  StyledEventEndedContainer,
  StyledEventEndedTitle,
  StyledEventEndedDescription
} from '@/routes/_authenticated/referral-event/-components/ReferralEvent.style';

interface ReferralEventProps {
  data: GetReferralMeResponse | undefined;
  isLoading: boolean;
}

export const ReferralEvent = ({ data, isLoading }: ReferralEventProps) => {
  const { t, locale } = useI18n(['referralEvent']);
  const { isMobile } = useBreakPoints();

  if (isLoading) {
    return (
      <Flex justify="center" alignItems="center" padding="60px">
        <Spinner size={32} />
      </Flex>
    );
  }

  if (!data) return null;

  const eventEndDate = new Date(data.eventEndsAt).toLocaleDateString(
    locale,
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  );

  if (!data.isEventActive) {
    return (
      <StyledContentContainer $isMobile={isMobile}>
        <StyledEventEndedContainer>
          <StyledEventEndedTitle>
            {t('referralEvent:eventEnded')}
          </StyledEventEndedTitle>
          <StyledEventEndedDescription>
            {t('referralEvent:eventEndedDescription')}
          </StyledEventEndedDescription>
        </StyledEventEndedContainer>
      </StyledContentContainer>
    );
  }

  return (
    <StyledContentContainer $isMobile={isMobile}>
      <StyledEventHeader>
        <StyledPageTitle $isMobile={isMobile}>
          {t('referralEvent:title')}
        </StyledPageTitle>
        <StyledEventPeriod>
          {t('referralEvent:eventPeriod', { date: eventEndDate })}
        </StyledEventPeriod>
      </StyledEventHeader>

      <ReferralLinkSection
        referralCode={data.referralCode}
        disabled={!data.isEventActive}
      />

      <ProgressSection
        effectiveCount={data.effectiveCount}
        rewards={data.rewards}
      />

      <EventInfoSection />
    </StyledContentContainer>
  );
};
