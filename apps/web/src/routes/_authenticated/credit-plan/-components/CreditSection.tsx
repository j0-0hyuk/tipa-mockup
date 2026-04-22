import {
  StyledSection,
  StyledSectionTitle,
  StyledCreditCard,
  StyledCreditInfo,
  StyledCreditAmount,
  StyledCreditDescription,
  StyledCreditDetailLink
} from '@/routes/_authenticated/credit-plan/-components/CreditPlan.style';
import { useI18n } from '@/hooks/useI18n.ts';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { Flex } from '@docs-front/ui';
import { CircleAlert } from 'lucide-react';
import { useTheme } from '@emotion/react';

interface CreditSectionProps {
  accountData:
    | {
        freeCredit: number;
        paidCredit: number;
      }
    | undefined;
}

export const CreditSection = ({ accountData }: CreditSectionProps) => {
  const { t } = useI18n(['creditPlan']);
  const { isMobile, sm } = useBreakPoints();
  const theme = useTheme();
  const paidCredit = accountData?.paidCredit ?? 0;

  return (
    <StyledSection $isMobile={isMobile}>
      <StyledSectionTitle>{t('creditPlan:myCredit')}</StyledSectionTitle>

      <StyledCreditCard $isSm={sm}>
        <StyledCreditInfo $isSm={sm}>
          <span>{t('creditPlan:currentCredit')} : </span>
          <StyledCreditAmount>{paidCredit.toLocaleString()}</StyledCreditAmount>
        </StyledCreditInfo>
      </StyledCreditCard>
      <Flex gap="8px" direction="row" alignItems="center">
        <CircleAlert size={16} color={theme.color.textGray} />
        <StyledCreditDescription>
          보유한 영구 크레딧은 사용량 기준을 초과한 경우에 사용됩니다.{' '}
          <StyledCreditDetailLink to="/credit-policy">
            더 자세히 보기
          </StyledCreditDetailLink>
        </StyledCreditDescription>
      </Flex>
    </StyledSection>
  );
};
