import { useI18n } from '@/hooks/useI18n';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import {
  StyledSection,
  StyledSectionTitle,
  StyledCard,
  StyledInfoCard,
  StyledInfoGroup,
  StyledInfoGroupTitle,
  StyledInfoItem
} from '@/routes/_authenticated/referral-event/-components/ReferralEvent.style';

export const EventInfoSection = () => {
  const { t } = useI18n(['referralEvent']);
  const { isMobile } = useBreakPoints();

  return (
    <StyledSection $isMobile={isMobile}>
      <StyledSectionTitle>
        {t('referralEvent:infoSection.title')}
      </StyledSectionTitle>
      <StyledCard>
        <StyledInfoCard>
          <StyledInfoGroup>
            <StyledInfoGroupTitle>
              {t('referralEvent:infoSection.howTo.title')}
            </StyledInfoGroupTitle>
            <StyledInfoItem>
              <span>1.</span>
              <span>{t('referralEvent:infoSection.howTo.step1')}</span>
            </StyledInfoItem>
            <StyledInfoItem>
              <span>2.</span>
              <span>{t('referralEvent:infoSection.howTo.step2')}</span>
            </StyledInfoItem>
            <StyledInfoItem>
              <span>3.</span>
              <span>{t('referralEvent:infoSection.howTo.step3')}</span>
            </StyledInfoItem>
            <StyledInfoItem>
              <span>4.</span>
              <span>{t('referralEvent:infoSection.howTo.step4')}</span>
            </StyledInfoItem>
          </StyledInfoGroup>

          <StyledInfoGroup>
            <StyledInfoGroupTitle>
              {t('referralEvent:infoSection.notice.title')}
            </StyledInfoGroupTitle>
            <StyledInfoItem>
              <span>•</span>
              <span>{t('referralEvent:infoSection.notice.item1')}</span>
            </StyledInfoItem>
            <StyledInfoItem>
              <span>•</span>
              <span>{t('referralEvent:infoSection.notice.item2')}</span>
            </StyledInfoItem>
            <StyledInfoItem>
              <span>•</span>
              <span>{t('referralEvent:infoSection.notice.item3')}</span>
            </StyledInfoItem>
            <StyledInfoItem>
              <span>•</span>
              <span>{t('referralEvent:infoSection.notice.item4')}</span>
            </StyledInfoItem>
          </StyledInfoGroup>
        </StyledInfoCard>
      </StyledCard>
    </StyledSection>
  );
};
