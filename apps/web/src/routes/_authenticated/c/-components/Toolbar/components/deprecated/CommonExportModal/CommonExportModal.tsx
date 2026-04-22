import { useI18n } from '@/hooks/useI18n';
import { Flex, Modal, RadioButton } from '@docs-front/ui';
import { exportDocx } from '@/markdown/utils/exportDocx';
import { exportHwpx } from '@/markdown/utils/exportHwpx';
import { exportPdf } from '@/markdown/utils/exportPdf';
import { useState } from 'react';
import {
  StyledRadioContainer,
  StyledRadioContainerGroup,
  StyledRadioLabel
} from '@/routes/_authenticated/c/-components/Toolbar/components/ExportModal/ExportModal.style';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { useBreakPoints } from '@/hooks/useBreakPoints';

interface CommonExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
}

export default function CommonExportModal({
  isOpen,
  onClose,
  itemName
}: CommonExportModalProps) {
  const { t } = useI18n(['main', 'export']);
  const [documentFormat, setDocumentFormat] = useState<'docx' | 'hwpx' | 'pdf'>(
    'docx'
  );
  const { sm } = useBreakPoints();

  const onSubmit = () => {
    if (documentFormat === 'docx') {
      exportDocx({ itemName: itemName ?? '사업계획서' });
    } else if (documentFormat === 'hwpx') {
      exportHwpx({ itemName: itemName ?? '사업계획서' });
    } else if (documentFormat === 'pdf') {
      exportPdf({
        fileName: `${itemName ?? '사업계획서'}.pdf`
      });
    }
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header title={'그대로 내보내기 '} />
      <Modal.Body>
        <Flex
          direction="column"
          gap={20}
          alignItems="flex-start"
          alignSelf="stretch"
        >
          <RadioGroupPrimitive.Root
            asChild
            value={documentFormat}
            onValueChange={(value) =>
              setDocumentFormat(value as 'docx' | 'hwpx' | 'pdf')
            }
          >
            <StyledRadioContainerGroup>
              <RadioGroupPrimitive.Item value="docx" asChild>
                <StyledRadioContainer>
                  <RadioButton />
                  <StyledRadioLabel isSm={sm}>
                    {t('export:format.docx')}
                  </StyledRadioLabel>
                </StyledRadioContainer>
              </RadioGroupPrimitive.Item>
              <RadioGroupPrimitive.Item value="hwpx" asChild>
                <StyledRadioContainer>
                  <RadioButton />
                  <StyledRadioLabel isSm={sm}>
                    {t('export:format.hwpx')}
                  </StyledRadioLabel>
                </StyledRadioContainer>
              </RadioGroupPrimitive.Item>
              <RadioGroupPrimitive.Item value="pdf" asChild>
                <StyledRadioContainer>
                  <RadioButton />
                  <StyledRadioLabel isSm={sm}>
                    {t('export:format.pdf' as 'export:format.docx')}
                  </StyledRadioLabel>
                </StyledRadioContainer>
              </RadioGroupPrimitive.Item>
            </StyledRadioContainerGroup>
          </RadioGroupPrimitive.Root>
        </Flex>
      </Modal.Body>
      <Modal.Footer>
        <Modal.ConfirmButton onClick={() => onSubmit()}>
          {t('common:button.export')}
        </Modal.ConfirmButton>
      </Modal.Footer>
    </Modal>
  );
}
