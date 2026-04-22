import { Flex, Button, ProductCreationLoadingToast } from '@/packages/ui/src';
import { FileText } from 'lucide-react';
import { useTheme } from '@emotion/react';
import { usePreventLeave } from '@/make/hooks/usePreventLeave';
import {
  StyledFileDownloadZone,
  StyledFileName,
  StyledToStepLabel
} from '@/make/pages/demo/components/FileDownloadZone/FileDownloadZone.style';

interface FileDownloadZoneProps {
  file: Blob;
  fileName: string;
  onNewDocument: () => void;
}

export default function FileDownloadZone({
  file,
  fileName,
  onNewDocument
}: FileDownloadZoneProps) {
  const theme = useTheme();

  usePreventLeave({
    shouldPrevent: fileName === '처리 중...' || (file && file.size > 0)
  });

  const handleDownload = () => {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isProcessing = fileName === '처리 중...';

  return (
    <StyledFileDownloadZone>
      {isProcessing ? (
        <Flex
          direction="column"
          alignItems="center"
          justify="center"
          height={'160px'}
        >
          <ProductCreationLoadingToast
            progress={0}
            isVisible={true}
            showSpinnerIcon
          />
        </Flex>
      ) : (
        <Flex direction="column" alignItems="center" gap="12px">
          <Flex direction="column" alignItems="center">
            <FileText size={80} strokeWidth={1} color={theme.color.black} />
            <StyledFileName
              onClick={handleDownload}
              style={{ cursor: 'pointer' }}
            >
              {fileName}
            </StyledFileName>
          </Flex>
          <Flex direction="row" gap="8px">
            <Button variant="outlined" size="medium" onClick={onNewDocument}>
              <StyledToStepLabel>다른 문서 만들기</StyledToStepLabel>
            </Button>

            <Button variant="filled" size="medium" onClick={handleDownload}>
              다운로드
            </Button>
          </Flex>
        </Flex>
      )}
    </StyledFileDownloadZone>
  );
}
