import { Modal, Button } from '@docs-front/ui';
import { useI18n } from '@/hooks/useI18n';
import {
  StyledSupportingText,
  StyledEmphasize,
  StyledError
} from '@/routes/_authenticated/c/-components/HwpWarningModal/HwpWarningModal.style';

interface HwpWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'hwp' | 'unsupported' | 'filesize';
}

export function HwpWarningModal({
  isOpen,
  onClose,
  type
}: HwpWarningModalProps) {
  const { t } = useI18n(['export', 'main']);
  const isHwpType = type === 'hwp';
  const isFileSizeType = type === 'filesize';

  const getTitle = () => {
    if (isHwpType) return t('export:alerts.hwpConversion.title');
    if (isFileSizeType) return t('export:alerts.fileSizeExceeded.title');
    return t('export:alerts.unsupportedFile.title');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header title={getTitle()} />
      <Modal.Body>
        <StyledSupportingText>
          {isHwpType ? (
            <>
              <StyledEmphasize>.hwpx</StyledEmphasize>{' '}
              {t('export:alerts.hwpConversion.description.line1')} <br />
              <br />
              <StyledError>
                {t('export:alerts.hwpConversion.description.line2')}
              </StyledError>
              <br />
              1. {t('export:alerts.hwpConversion.description.steps.step1')}
              <br />
              2. {t('export:alerts.hwpConversion.description.steps.step2')}
              <br />
              3. {t('export:alerts.hwpConversion.description.steps.step3')}
              <br />
              4. {t('export:alerts.hwpConversion.description.steps.step4')}
              <br />
              <br />
              <StyledError>
                {t('export:alerts.hwpConversion.guideToConvert')}
              </StyledError>
              <br />
              <a
                href="https://www.polarisofficetools.com/hwp/convert/hwpx"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#3182F7', textDecoration: 'underline' }}
              >
                {t('export:alerts.hwpConversion.convertLinkText')}
              </a>
            </>
          ) : isFileSizeType ? (
            <>
              <StyledError>
                {t('export:alerts.fileSizeExceeded.description.line1')}
              </StyledError>
              <br />
              <br />
              {t('export:alerts.fileSizeExceeded.description.line2')}
              <br />
              {t('export:alerts.fileSizeExceeded.description.line3')}
            </>
          ) : (
            <>
              {t('export:alerts.unsupportedFile.description.line1')} <br />
              <br /> {t('export:alerts.unsupportedFile.description.line2')}
            </>
          )}
        </StyledSupportingText>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="filled" size="large" onClick={onClose}>
          {t('main:export.drawer.alerts.confirm')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
