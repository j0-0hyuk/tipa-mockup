import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Flex } from '@/packages/ui/src';
import { FileText } from 'lucide-react';
import { useTheme } from '@emotion/react';
import { Button } from '@/packages/ui/src';
import {
  StyledFileDownloadZone,
  StyledFileName,
  StyledToStepLabel
} from '@/make/pages/demo/components/FileDownloadZone/FileDownloadZone.style';

export default function DemoFilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { file, fileName } =
    (location.state as { file: Blob; fileName: string }) || {};

  useEffect(() => {
    if (file && fileName) {
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, []);

  const handleDownload = () => {
    if (file && fileName) {
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleGoToDemo = () => {
    navigate('/');
  };

  if (!file || !fileName) {
    return (
      <Flex direction="column" alignItems="center" justify="center">
        <p>파일을 찾을 수 없습니다.</p>
        <Button variant="filled" size="medium" onClick={handleGoToDemo}>
          처음으로 돌아가기
        </Button>
      </Flex>
    );
  }

  return (
    <Flex direction="column" alignItems="center" justify="center" width="100%">
      <StyledFileDownloadZone>
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
            <Button variant="outlined" size="medium" onClick={handleGoToDemo}>
              <StyledToStepLabel>다른 문서 만들기</StyledToStepLabel>
            </Button>

            <Button variant="filled" size="medium" onClick={handleDownload}>
              다운로드
            </Button>
          </Flex>
        </Flex>
      </StyledFileDownloadZone>
    </Flex>
  );
}
