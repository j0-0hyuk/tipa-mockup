import { Flex, Modal } from '@docs-front/ui';
import { useTheme } from '@emotion/react';
import { CircleAlert } from 'lucide-react';
import styled from '@emotion/styled';
import { useI18n } from '@/hooks/useI18n';

const StyledSupportingText = styled.p`
  color: ${({ theme }) => theme.color.black};
  ${({ theme }) => theme.typo.Rg_16}
`;

interface ExportFailedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportFailedModal({
  isOpen,
  onClose
}: ExportFailedModalProps) {
  const { currentLanguage } = useI18n([]);

  const isKorean = currentLanguage === 'ko';

  const title = isKorean ? '내보내기 실패' : 'Export Failed';
  const line1 = isKorean
    ? '원하는 양식으로 내보내기에 실패했어요.'
    : 'Failed to export with the desired template.';
  const errorText = isKorean
    ? '오류 신고 시, 소진된 크레딧을 바로 복원'
    : 'Report the error to restore your used credits';
  const line2Part1 = isKorean ? '해드려요.' : ' immediately.';
  const line3Part1 = isKorean
    ? '간혹 hwp 내보내기가 불안정할 수 있어'
    : 'HWP export can be unstable sometimes, so we';
  const recommendText = isKorean ? 'hwpx 사용을 권장' : 'recommend using HWPX';
  const line3Part2 = isKorean ? '드립니다.' : '.';
  const cancelButton = isKorean ? '닫기' : 'Close';
  const reportButton = isKorean ? '오류 신고' : 'Report Error';

  const handleUserReportErrorsClick = () => {
    onClose();
    window.ChannelIO?.('showMessenger');
  };

  const theme = useTheme();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header
        title={
          <Flex direction="row" alignItems="center" gap="8px">
            <CircleAlert size={24} />
            <p>{title}</p>
          </Flex>
        }
      />
      <Modal.Body>
        <StyledSupportingText>
          {line1}
          <br />
          <span
            style={{
              color: theme.color.error,
              fontWeight: 'bold'
            }}
          >
            {errorText}
          </span>
          {line2Part1}
          <br /> {line3Part1}{' '}
          <span
            style={{
              color: theme.color.main,
              fontWeight: 'bold'
            }}
          >
            {recommendText}
          </span>
          {line3Part2}
        </StyledSupportingText>
      </Modal.Body>
      <Modal.Footer>
        <Modal.CancelButton onClick={onClose}>
          {cancelButton}
        </Modal.CancelButton>
        <Modal.ConfirmButton onClick={handleUserReportErrorsClick}>
          {reportButton}
        </Modal.ConfirmButton>
      </Modal.Footer>
    </Modal>
  );
}
