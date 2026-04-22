import { Button, Flex, IconButton } from '@docs-front/ui';
import { PricingPlanModal } from '@/routes/_authenticated/credit-plan/-components/PricingPlanModal/PricingPlanModal';
import { useI18n } from '@/hooks/useI18n';
import {
  StyledBadgeContainer,
  StyledBadgeInner,
  StyledBadgeText,
  StyledBlackText,
  StyledMainText,
  StyledPunnelSection
} from '@/routes/_authenticated/-components/Punnel/Punnel.style';
import { useState } from 'react';
import { X } from 'lucide-react';

interface PunnelProps {
  isMobile: boolean;
}

export function Punnel({ isMobile }: PunnelProps) {
  const { t } = useI18n(['main']);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <StyledPunnelSection $isMobile={isMobile}>
      <StyledBadgeContainer>
        <StyledBadgeInner>
          <StyledBadgeText>
            <StyledBlackText as="span">2026 Master 플랜</StyledBlackText>
            <StyledMainText as="span">
              {'2차 얼리버드 79% 할인!'}
            </StyledMainText>
          </StyledBadgeText>
          <PricingPlanModal>
            <Button variant="filled" size="small">
              {t('mainPage.promo.cta')}
            </Button>
          </PricingPlanModal>
        </StyledBadgeInner>
      </StyledBadgeContainer>
      <Flex>
        <IconButton variant="text" size="small" onClick={handleClose}>
          <X size={12} strokeWidth={1.5} />
        </IconButton>
      </Flex>
    </StyledPunnelSection>
  );
}
