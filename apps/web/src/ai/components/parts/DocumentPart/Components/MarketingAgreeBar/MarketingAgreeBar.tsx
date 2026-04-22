import {
  StyledMarketingAgreeBar,
  StyledMarketingAgreeBarText
} from '@/ai/components/parts/DocumentPart/Components/MarketingAgreeBar/MarketingAgreeBar.style';
import { Button, Flex, useToast } from '@docs-front/ui';
import { postTerms } from '@/api/terms';
import { useTheme } from '@emotion/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { useI18n } from '@/hooks/useI18n';
import { ChevronRight } from 'lucide-react';

export default function MarketingAgreeBar() {
  const theme = useTheme();
  const { t } = useI18n('main');
  const toast = useToast();
  const queryClient = useQueryClient();
  const { mutate: updateMarketingAgree, isPending } = useMutation({
    mutationFn: postTerms,
    onSuccess: () => {
      queryClient.invalidateQueries(getAccountMeQueryOptions());
      toast.open({
        content: t('chat.marketingAgree.notificationEnabled'),
        duration: 3000
      });
    }
  });

  const handleMarketingAgree = () => {
    updateMarketingAgree({
      termsAgreements: [
        {
          termsCode: 'MARKETING_CONSENT',
          agreed: true
        }
      ]
    });
  };

  return (
    <StyledMarketingAgreeBar>
      <Flex alignItems="center" gap={4}>
        <StyledMarketingAgreeBarText>
          {t('chat.marketingAgree.title')}
        </StyledMarketingAgreeBarText>
        <ChevronRight size={16} color={theme.color.textPlaceholder} />
      </Flex>
      <Button
        variant="filled"
        size="medium"
        onClick={handleMarketingAgree}
        disabled={isPending}
      >
        {t('chat.marketingAgree.button')}
      </Button>
    </StyledMarketingAgreeBar>
  );
}
