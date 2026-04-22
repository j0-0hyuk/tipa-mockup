import { Button, Flex, Spinner } from '@docs-front/ui';
import type { DocshuntMarkdownData } from '@/ai/ui-message';
import { CheckCheck, X } from 'lucide-react';
import { useTheme } from '@emotion/react';
import { useCallback, useEffect, useMemo } from 'react';
import { useI18n } from '@/hooks/useI18n';
import DocshuntMarkdown from '@/markdown/DocshuntMarkdown';
import { useProductId } from '@/hooks/useProductId';

interface MarkdownPartProps {
  data: DocshuntMarkdownData;
  markdown: string;
  messageId: string;
  onReviewDone: (messageId: string) => void;
  onApplyAll: ({
    markdown,
    productId
  }: {
    markdown: string;
    productId: number;
  }) => void;
  onCancelAll: ({
    markdown,
    productId
  }: {
    markdown: string;
    productId: number;
  }) => void;
  reviewCount: number;
}

export const MarkdownPart = ({
  data,
  markdown,
  messageId,
  onApplyAll,
  onCancelAll,
  onReviewDone,
  reviewCount
}: MarkdownPartProps) => {
  const theme = useTheme();
  const { t } = useI18n('main');
  const $color = useMemo(() => {
    if (data.status === 'abort') {
      return 'error';
    }
    return 'main';
  }, [data.status]);

  const productId = useProductId();

  const handleApplyAll = useCallback(() => {
    onApplyAll({
      markdown: DocshuntMarkdown.from(markdown).applyAll().markdown,
      productId: Number(productId)
    });
  }, [markdown, onApplyAll, productId]);

  const handleCancelAll = useCallback(() => {
    onCancelAll({
      markdown: DocshuntMarkdown.from(markdown).cancelAll().markdown,
      productId: Number(productId)
    });
  }, [markdown, onCancelAll, productId]);

  useEffect(() => {
    if (data.status === 'review' && reviewCount === 0) {
      onReviewDone(messageId);
    }
  }, [data.status, reviewCount, messageId, onReviewDone, data.value, markdown]);

  return (
    <Flex alignItems="center" $typo="Md_16" $color={$color} gap={8}>
      {data.status === 'thinking' && (
        <>
          <Spinner size={20} />
          <span>{t('chat.status.thinking')}</span>
        </>
      )}
      {data.status === 'streaming' && (
        <>
          <Spinner size={20} />
          <span>{t('chat.status.streaming')}</span>
        </>
      )}
      {data.status === 'abort' && (
        <>
          <X size={20} color={theme.color.error} />
          <span>{t('chat.status.abort')}</span>
        </>
      )}
      {data.status === 'review' && (
        <Flex
          direction="column"
          gap={8}
          width="100%"
          $color="black"
          $typo="Rg_16"
        >
          <span>수정 사항이 있습니다. 검토를 진행하세요.</span>
          <Flex
            $borderColor="borderGray"
            $borderRadius="xl"
            padding="0 10px 0 12px"
            $bgColor="white"
            height={50}
            justify="space-between"
            alignItems="center"
            width="100%"
          >
            <Flex alignItems="center" gap={6} $typo="Md_15">
              <span>수정 사항</span>
              <Flex $color="main" $typo="Sb_16">
                {reviewCount}
              </Flex>
            </Flex>
            <Flex alignItems="center" gap={6}>
              <Button variant="text" size="small" onClick={handleCancelAll}>
                {reviewCount}개 모두 취소
              </Button>
              <Button variant="filled" size="small" onClick={handleApplyAll}>
                {reviewCount}개 모두 적용
              </Button>
            </Flex>
          </Flex>
        </Flex>
      )}
      {data.status === 'done' && (
        <>
          <CheckCheck size={20} color={theme.color.main} />
          <span>{t('chat.status.done')}</span>
        </>
      )}
    </Flex>
  );
};
