import { Flex, IconButton } from '@docs-front/ui';
import { File, X } from 'lucide-react';
import { useTheme } from '@emotion/react';
import { StyledUploadedFileBadge } from '@/routes/_authenticated/c/-components/ChatSection/ChatInput/UploadedFileBadges/UploadedFileBadges.style';
import { useCallback } from 'react';

interface UploadedFileBadgeProps {
  fileName: string;
  onRemove: (fileName: string) => void;
}

export const UploadedFileBadge = ({
  fileName,
  onRemove
}: UploadedFileBadgeProps) => {
  const theme = useTheme();

  const handleRemove = useCallback(() => {
    onRemove(fileName);
  }, [fileName, onRemove]);

  return (
    <Flex
      maxWidth="100%"
      $typo="Md_16"
      height={32}
      padding="0 12px"
      alignItems="center"
      gap={4}
      $bgColor="bgBlueGray"
      $borderRadius="full"
      $color="textGray"
    >
      <File size={20} color={theme.color.textGray} />
      <StyledUploadedFileBadge>{fileName}</StyledUploadedFileBadge>
      <IconButton
        type="button"
        variant="text"
        size="small"
        onClick={handleRemove}
      >
        <X size={20} color={theme.color.textGray} />
      </IconButton>
    </Flex>
  );
};
