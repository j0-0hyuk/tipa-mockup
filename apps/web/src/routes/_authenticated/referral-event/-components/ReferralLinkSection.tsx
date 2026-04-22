import { useToast } from '@docs-front/ui';
import { Button } from '@bichon/ds';
import { useI18n } from '@/hooks/useI18n';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import {
  StyledSection,
  StyledSectionTitle,
  StyledCard,
  StyledLinkContainer,
  StyledLinkInput
} from '@/routes/_authenticated/referral-event/-components/ReferralEvent.style';

interface ReferralLinkSectionProps {
  referralCode: string;
  disabled: boolean;
}

export const ReferralLinkSection = ({
  referralCode,
  disabled
}: ReferralLinkSectionProps) => {
  const { t } = useI18n(['referralEvent']);
  const { isMobile } = useBreakPoints();
  const toast = useToast();

  const referralLink = `${window.location.origin}/?ref=${referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.open({ content: t('referralEvent:linkSection.copied') });
    } catch {
      // fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = referralLink;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      toast.open({ content: t('referralEvent:linkSection.copied') });
    }
  };

  return (
    <StyledSection $isMobile={isMobile}>
      <StyledSectionTitle>
        {t('referralEvent:linkSection.title')}
      </StyledSectionTitle>
      <StyledCard>
        <StyledLinkContainer $isMobile={isMobile}>
          <StyledLinkInput>{referralLink}</StyledLinkInput>
          <Button
            variant="filled"
            size="medium"
            width={isMobile ? '100%' : undefined}
            onClick={handleCopy}
            disabled={disabled}
          >
            {t('referralEvent:linkSection.copy')}
          </Button>
        </StyledLinkContainer>
      </StyledCard>
    </StyledSection>
  );
};
