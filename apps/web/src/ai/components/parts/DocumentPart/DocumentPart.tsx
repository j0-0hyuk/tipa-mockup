import { Flex, Spinner } from '@docs-front/ui';
import type { DocshuntDocumentData } from '@/ai/ui-message';
import { CheckCheck } from 'lucide-react';
import { useTheme } from '@emotion/react';
import { StyledGeneratingEmailText } from '@/ai/components/parts/DocumentPart/DocumentPart.style';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { useSuspenseQuery } from '@tanstack/react-query';
import MarketingAgreeBar from '@/ai/components/parts/DocumentPart/Components/MarketingAgreeBar/MarketingAgreeBar';
import Tally from '@/ai/components/parts/DocumentPart/Components/Tally/Tally';
import { useI18n } from '@/hooks/useI18n';

interface DocumentPartProps {
  data: DocshuntDocumentData;
}

export const DocumentPart = ({ data }: DocumentPartProps) => {
  const theme = useTheme();
  const { t } = useI18n('main');
  const { data: me } = useSuspenseQuery(getAccountMeQueryOptions());
  const agreeMarketing = me?.termsConsents[2].agreed;

  return (
    <>
      {data.status === 'generating' && (
        <Flex direction="column" alignItems="start" justify="center" gap={8}>
          <Flex alignItems="center" $typo="Md_16" $color="main" gap={8}>
            <Spinner size={20} />
            <span>{t('chat.status.documentGenerating')}</span>
          </Flex>
          <StyledGeneratingEmailText
            dangerouslySetInnerHTML={{
              __html: t('chat.status.emailNotification')
            }}
          />
          {agreeMarketing ? <Tally /> : <MarketingAgreeBar />}
        </Flex>
      )}
      {data.status === 'done' && (
        <Flex alignItems="center" $typo="Md_16" $color="main" gap={8}>
          <CheckCheck size={20} color={theme.color.main} />
          <span>{t('chat.status.documentDone')}</span>
        </Flex>
      )}
    </>
  );
};
