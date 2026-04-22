import { getAccountMeQueryOptions } from '@/query/options/account';
import { PricingPlanModal } from '@/routes/_authenticated/credit-plan/-components/PricingPlanModal/PricingPlanModal';
import { Button } from '@docs-front/ui';
import {
  StyledContainer,
  StyledDescription,
  StyledInnerContainer,
  StyledSubTitle,
  StyledTitle
} from '@/routes/_authenticated/c/-components/ChatSection/ChatNoCreditState/ChatNoCreditState.style';
import { useI18n } from '@/hooks/useI18n';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function ChatNoCreditState() {
  const { data: account } = useSuspenseQuery(getAccountMeQueryOptions());
  const { t } = useI18n('main');
  const isFree = account.role === 'FREE';
  return (
    <>
      <StyledContainer>
        <StyledInnerContainer>
          <StyledTitle>
            {isFree
              ? t('chat.noCredit.title.free')
              : t('chat.noCredit.title.pro')}
          </StyledTitle>
          <StyledDescription>
            {isFree
              ? t('chat.noCredit.description.free')
              : t('chat.noCredit.description.pro')}
          </StyledDescription>
          <PricingPlanModal>
            <Button
              variant="filled"
              size="medium"
              width="100%"
              onClick={() => {}}
            >
              {isFree
                ? t('chat.noCredit.button.free')
                : t('chat.noCredit.button.pro')}
            </Button>
          </PricingPlanModal>
        </StyledInnerContainer>
      </StyledContainer>
      {isFree && <StyledSubTitle>{t('chat.noCredit.subTitle')}</StyledSubTitle>}
    </>
  );
}
