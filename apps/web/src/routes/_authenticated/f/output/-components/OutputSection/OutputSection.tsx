import { Paperclip, Download, Info } from 'lucide-react';
import { Flex, Spinner, Progress, Button } from '@docs-front/ui';
import { useNavigate } from '@tanstack/react-router';
import {
  StyledOutputSection,
  StyledLoadingContent,
  StyledLoadingText,
  StyledProgressWrapper,
  StyledCompletedContent,
  StyledFileNameRow,
  StyledFileName,
  StyledLoadingDescription,
  StyledLoadingHint,
  StyledFailedContent,
  StyledFailedMessage
} from '@/routes/_authenticated/f/output/-components/OutputSection/OutputSection.style';
import { useI18n } from '@/hooks/useI18n';
import { useOutputSection } from '@/routes/_authenticated/f/output/-components/OutputSection/OutputSection.hook';

interface OutputSectionProps {
  productFileId: number;
}

export default function OutputSection({ productFileId }: OutputSectionProps) {
  const { t } = useI18n(['main']);
  const navigate = useNavigate();
  const {
    progress,
    error,
    isStatusCompleted,
    isStatusFailed,
    isProcessing,
    displayFileName,
    isDownloading,
    handleDownload
  } = useOutputSection(productFileId);

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
      return;
    }

    navigate({ to: '/f/template' });
  };

  if (isStatusFailed) {
    return (
      <StyledOutputSection>
        <StyledFailedContent>
          <StyledFailedMessage>
            <StyledLoadingText>오류가 발생했습니다.</StyledLoadingText>
            <StyledLoadingDescription>
              파일 생성에 실패했습니다.
            </StyledLoadingDescription>
          </StyledFailedMessage>
          <Button
            type="button"
            variant="outlined"
            size="medium"
            onClick={handleGoBack}
          >
            이전으로 돌아가기
          </Button>
        </StyledFailedContent>
      </StyledOutputSection>
    );
  }

  if (error) {
    throw new Error(error.message);
  }

  if (!productFileId) {
    return null;
  }

  return (
    <StyledOutputSection>
      {isProcessing ? (
        <StyledLoadingContent>
          <Flex direction="column" alignItems="center" gap="16px">
            <Flex direction="row" alignItems="center" gap="8px">
              <Spinner size={20} />
              <StyledLoadingText>
                문서 파일을 작성하고 있습니다...
              </StyledLoadingText>
            </Flex>
            <StyledProgressWrapper>
              <Progress progress={progress} height="8px" />
            </StyledProgressWrapper>
            <StyledLoadingDescription>
              문서 크기에 따라 처리 시간이 길어질 수 있어요 (약 10분)
            </StyledLoadingDescription>
            <StyledLoadingHint>
              <Info size={14} />
              화면을 닫아도 완료되면 문서함에서 확인할 수 있어요
            </StyledLoadingHint>
            <Button
              type="button"
              variant="outlined"
              size="medium"
              onClick={() => navigate({ to: '/f/template' })}
            >
              {t('main:fillForm.output.startOver')}
            </Button>
          </Flex>
        </StyledLoadingContent>
      ) : isStatusCompleted ? (
        <StyledCompletedContent>
          <Flex direction="column" alignItems="center" gap="16px">
            <StyledFileNameRow>
              <Paperclip size={18} />
              <StyledFileName
                type="button"
                $disabled={isDownloading}
                disabled={isDownloading}
                onClick={() => {
                  void handleDownload();
                }}
              >
                {displayFileName}
              </StyledFileName>
            </StyledFileNameRow>
            <Flex direction="row" gap={12} alignItems="center">
              <Button
                type="button"
                variant="outlined"
                size="medium"
                onClick={() => navigate({ to: '/f/template' })}
              >
                {t('main:fillForm.output.startOver')}
              </Button>
              <Button
                type="button"
                variant="filled"
                size="medium"
                onClick={() => {
                  void handleDownload();
                }}
                disabled={isDownloading}
              >
                {isDownloading ? <Spinner size={20} /> : <Download size={20} />}
                {isDownloading ? '다운로드 중...' : t('main:fillForm.output.download')}
              </Button>
            </Flex>
          </Flex>
        </StyledCompletedContent>
      ) : null}
    </StyledOutputSection>
  );
}
