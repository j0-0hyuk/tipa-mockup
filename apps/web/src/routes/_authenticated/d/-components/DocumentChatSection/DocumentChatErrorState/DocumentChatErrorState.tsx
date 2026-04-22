import { Button, Flex } from '@docs-front/ui';
import { useTheme } from '@emotion/react';
import { RotateCcw, TriangleAlert } from 'lucide-react';

interface DocumentChatErrorStateProps {
  onRetry: () => void;
}

export const DocumentChatErrorState = ({
  onRetry
}: DocumentChatErrorStateProps) => {
  const theme = useTheme();

  return (
    <Flex
      $borderRadius="lg"
      padding="12px 16px"
      $bgColor="errorBg"
      alignItems="center"
      justify="space-between"
      gap={12}
    >
      <Flex alignItems="center" gap={8} $color="error" $typo="Md_14">
        <TriangleAlert size={18} color={theme.color.error} />
        <span>오류가 발생했습니다.</span>
      </Flex>
      <Button variant="outlined" size="small" onClick={onRetry}>
        <Flex alignItems="center" gap={6}>
          <RotateCcw size={14} />
          다시 시도하기
        </Flex>
      </Button>
    </Flex>
  );
};
