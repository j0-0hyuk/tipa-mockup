import { Flex, IconButton } from '@docs-front/ui';
import { FileText, X } from 'lucide-react';
import { useTheme } from '@emotion/react';
import { useCallback } from 'react';
import { getFileTypeInfo } from '@/routes/_authenticated/d/-components/DocumentChatSection/DocumentChatInput/file-type-utils';
import {
  StyledFileCard,
  StyledFileIconWrapper,
  StyledFileInfo,
  StyledFileName,
  StyledExtensionBadge,
  StyledExpiredBadge
} from '@/routes/_authenticated/d/-components/DocumentChatSection/DocumentChatInput/FileCard/FileCard.style';

interface FileCardProps {
  fileName: string;
  expired?: boolean;
  onRemove?: (fileName: string) => void;
}

export const FileCard = ({ fileName, expired, onRemove }: FileCardProps) => {
  const theme = useTheme();
  const fileType = getFileTypeInfo(fileName);

  const handleRemove = useCallback(() => {
    onRemove?.(fileName);
  }, [fileName, onRemove]);

  return (
    <StyledFileCard style={expired ? { opacity: 0.6 } : undefined}>
      <StyledFileIconWrapper $bgColor={expired ? theme.color.bgLightGray : fileType.bgColor}>
        <FileText size={18} color={expired ? theme.color.textGray : fileType.color} />
      </StyledFileIconWrapper>
      <StyledFileInfo>
        <StyledFileName>{fileName}</StyledFileName>
        {expired ? (
          <StyledExpiredBadge>만료됨</StyledExpiredBadge>
        ) : (
          <StyledExtensionBadge>{fileType.label}</StyledExtensionBadge>
        )}
      </StyledFileInfo>
      {onRemove && (
        <IconButton
          type="button"
          variant="text"
          size="small"
          onClick={handleRemove}
        >
          <X size={16} color={theme.color.textGray} />
        </IconButton>
      )}
    </StyledFileCard>
  );
};

interface FileCardListProps {
  files: Array<{ name: string; expired?: boolean }>;
  onRemove?: (fileName: string) => void;
}

export const FileCardList = ({ files, onRemove }: FileCardListProps) => {
  if (files.length === 0) return null;

  return (
    <Flex gap={8} style={{ overflowX: 'auto', flexShrink: 0 }}>
      {files.map((file) => (
        <FileCard
          key={file.name}
          fileName={file.name}
          expired={file.expired}
          onRemove={onRemove}
        />
      ))}
    </Flex>
  );
};
