import { Button, Dialog, Flex } from '@docs-front/ui';
import { useI18n } from '@/hooks/useI18n';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  showPdfConversion?: boolean;
}

export const XmlCharacterLimitModal = ({
  isOpen,
  onClose,
  showPdfConversion = false
}: Props) => {
  const { t } = useI18n(['main']);

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <Dialog.title>{t('mainPrompt.xmlCharacterLimitModal.title')}</Dialog.title>
      <Dialog.content>
        <div>
          {t('mainPrompt.xmlCharacterLimitModal.description')}
          <br />
          {showPdfConversion ? (
            <>
              {t('mainPrompt.xmlCharacterLimitModal.convertToPdf')}
              <br />
              <br />
              <a
                href="https://www.polarisofficetools.com/hwpx/convert/pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#3182F7', textDecoration: 'underline' }}
              >
                {t('mainPrompt.xmlCharacterLimitModal.convertLinkText')}
              </a>
            </>
          ) : (
            t('mainPrompt.xmlCharacterLimitModal.reduceContent')
          )}
        </div>
      </Dialog.content>
      <Dialog.footer>
        <Flex direction="row" width="100%" justify="flex-end">
          <Button variant="outlined" size="medium" onClick={onClose}>
            {t('export.drawer.alerts.confirm')}
          </Button>
        </Flex>
      </Dialog.footer>
    </Dialog>
  );
};
