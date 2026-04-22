import { Button, Flex } from '@docs-front/ui';
import { useTheme } from '@emotion/react';
import { RotateCcw, TriangleAlert } from 'lucide-react';
import { useCallback } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { useBreakPoints } from '@/hooks/useBreakPoints';

interface ChatErrorStateProps {
  onRegenerate: () => void;
}

export const ChatErrorState = ({ onRegenerate }: ChatErrorStateProps) => {
  const theme = useTheme();
  const { t } = useI18n('main');
  const { sm } = useBreakPoints();
  const handleRegenerate = useCallback(() => {
    onRegenerate();
  }, [onRegenerate]);
  return (
    <Flex
      $borderRadius="xxl"
      padding="12px 14px"
      $bgColor="errorBg"
      $borderColor="error"
      alignItems="center"
      justify="space-between"
      $color="error"
      $typo={sm ? 'Rg_14' : 'Md_16'}
    >
      <Flex alignItems="center" gap={6}>
        <TriangleAlert size={sm ? 16 : 20} color={theme.color.error} />
        {t('chat.error.failed')}
      </Flex>
      <Button
        variant="outlined"
        size={sm ? 'small' : 'medium'}
        onClick={handleRegenerate}
      >
        <Flex alignItems="center" gap={4}>
          <RotateCcw size={sm ? 12 : 16} />
          {t('chat.error.retry')}
        </Flex>
      </Button>
    </Flex>
  );
};
