import { createElement, useCallback, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { HTTPError } from 'ky';
import { useModal } from '@/hooks/useModal';
import { useI18n } from '@/hooks/useI18n';
import { Button, Dialog, Flex, Modal } from '@docs-front/ui';
import { StyledSupportingText } from '@/routes/_authenticated/c/-components/HwpWarningModal/HwpWarningModal.style';
import { postFileValidate } from '@/api/products/validate';
import { InvalidXmlFileModal } from '@/routes/_authenticated/c/-components/MainPrompt/InvalidXmlFileModal';
import { InvalidPdfFileModal } from '@/routes/_authenticated/c/-components/MainPrompt/InvalidPdfFileModal';
import { XmlCharacterLimitModal } from '@/routes/_authenticated/c/-components/MainPrompt/XmlCharacterLimitModal';

export const MAX_FILES = 3;
const MAX_FILE_SIZE = 30 * 1024 * 1024;

const SUPPORTED_EXTENSIONS = ['.pdf', '.docx', '.hwp', '.hwpx', '.png'];
const SUPPORTED_EXTENSIONS_WITHOUT_IMAGE = ['.pdf', '.docx', '.hwp', '.hwpx'];

export function validateReferenceFile(
  file: File,
  excludeImageExtensions: boolean = false
): { isValid: boolean; error?: 'unsupported' | 'filesize' } {
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: 'filesize' };
  }
  const fileName = file.name.toLowerCase();
  const allowedExtensions = excludeImageExtensions
    ? SUPPORTED_EXTENSIONS_WITHOUT_IMAGE
    : SUPPORTED_EXTENSIONS;
  const isValidExtension = allowedExtensions.some((ext) =>
    fileName.endsWith(ext)
  );
  if (!isValidExtension) {
    return { isValid: false, error: 'unsupported' };
  }
  return { isValid: true };
}

interface UseReferenceFilesOptions {
  fieldName?: string;
  disabled?: boolean;
  excludeImageExtensions?: boolean;
  shouldDirty?: boolean;
}

export function useReferenceFiles({
  fieldName = 'references',
  disabled = false,
  excludeImageExtensions = false,
  shouldDirty = false
}: UseReferenceFilesOptions = {}) {
  const { setValue, watch, getValues } =
    useFormContext<Record<string, File[] | undefined>>();
  const references = watch(fieldName);
  const files = references || [];
  const [isDragOver, setIsDragOver] = useState(false);
  const [validatingFiles, setValidatingFiles] = useState<Set<string>>(
    new Set()
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modal = useModal();
  const { t } = useI18n(['export', 'main']);
  const isValidatingFiles = validatingFiles.size > 0;

  const openAlertDialog = useCallback(
    (title: string, description: React.ReactNode) => {
      modal.openModal(({ isOpen, onClose }) => (
        <Modal isOpen={isOpen} onClose={onClose}>
          <Modal.Header title={title} />
          <Modal.Body>{description}</Modal.Body>
          <Modal.Footer>
            <Modal.ConfirmButton onClick={onClose}>
              {t('main:export.drawer.alerts.confirm')}
            </Modal.ConfirmButton>
          </Modal.Footer>
        </Modal>
      ));
    },
    [modal, t]
  );

  const openUploadErrorDialog = useCallback(
    (message: string) => {
      modal.openModal(({ isOpen, onClose }) => (
        <Dialog isOpen={isOpen} onClose={onClose}>
          <Dialog.title>{t('main:fillForm.template.uploadError.title')}</Dialog.title>
          <Dialog.content>
            <StyledSupportingText>{message}</StyledSupportingText>
          </Dialog.content>
          <Dialog.footer>
            <Flex direction="row" width="100%" justify="flex-end">
              <Button variant="outlined" size="medium" onClick={onClose}>
                {t('main:export.drawer.alerts.confirm')}
              </Button>
            </Flex>
          </Dialog.footer>
        </Dialog>
      ));
    },
    [modal, t]
  );

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles || newFiles.length === 0) return;
      if (disabled) return;

      const currentFiles = references || [];
      const fileArray = Array.from(newFiles);
      const remainingSlots = MAX_FILES - currentFiles.length;
      const filesToAdd = fileArray.slice(0, remainingSlots);

      const isDuplicateFile = (file: File, existingFiles: File[]): boolean =>
        existingFiles.some(
          (existingFile) =>
            existingFile.name === file.name && existingFile.size === file.size
        );

      const validFiles: File[] = [];
      for (const file of filesToAdd) {
        const validation = validateReferenceFile(file, excludeImageExtensions);
        if (validation.isValid) {
          if (isDuplicateFile(file, [...currentFiles, ...validFiles])) {
            openAlertDialog(
              t('export:alerts.duplicateFile.title'),
              <StyledSupportingText>
                {t('export:alerts.duplicateFile.description')}
              </StyledSupportingText>
            );
          } else {
            validFiles.push(file);
          }
        } else {
          if (validation.error === 'filesize') {
            openAlertDialog(
              t('export:alerts.fileSizeExceeded.title'),
              <StyledSupportingText>
                {t('export:alerts.fileSizeExceeded.description.line1')} <br />
                <br /> {t('export:alerts.fileSizeExceeded.description.line2')}
                <br /> {t('export:alerts.fileSizeExceeded.description.line3')}
              </StyledSupportingText>
            );
          } else if (validation.error === 'unsupported') {
            openAlertDialog(
              t('export:alerts.unsupportedFile.title'),
              <StyledSupportingText>
                {t('export:alerts.unsupportedFile.description.line1')} <br />
                <br /> {t('export:alerts.unsupportedFile.description.line2')}
              </StyledSupportingText>
            );
          }
        }
      }

      if (validFiles.length > 0) {
        const updatedFiles = [...currentFiles, ...validFiles];
        setValue(fieldName, updatedFiles, {
          shouldValidate: true,
          shouldDirty: shouldDirty
        });

        for (const file of validFiles) {
          const fileKey = `${file.name}-${file.size}`;
          setValidatingFiles((prev) => new Set(prev).add(fileKey));

          postFileValidate(file, 'REFERENCE')
            .catch((error) => {
              let status: number | undefined;
              const currentRefs = getValues(fieldName) || [];
              const filtered = currentRefs.filter((f) => f !== file);
              setValue(
                fieldName,
                filtered.length > 0 ? filtered : undefined,
                { shouldValidate: true, shouldDirty: shouldDirty }
              );

              if (error instanceof HTTPError) {
                status = error.response?.status;
                if (
                  status === 413 &&
                  error.message?.includes('XML character limit exceeded')
                ) {
                  modal.openModal(({ isOpen, onClose }) =>
                    createElement(XmlCharacterLimitModal, {
                      isOpen,
                      onClose,
                      showPdfConversion: true
                    })
                  );
                  return;
                }
                if (
                  status === 400 &&
                  error.message === '유효한 XML 형식이 아닙니다.'
                ) {
                  modal.openModal(({ isOpen, onClose }) =>
                    createElement(InvalidXmlFileModal, { isOpen, onClose })
                  );
                  return;
                }
                if (
                  status === 400 &&
                  error.message?.includes('텍스트를 추출할 수 없는 PDF')
                ) {
                  modal.openModal(({ isOpen, onClose }) =>
                    createElement(InvalidPdfFileModal, {
                      isOpen,
                      onClose,
                      type: 'image'
                    })
                  );
                  return;
                }
                if (
                  status === 400 &&
                  error.message?.includes('has not been decrypted')
                ) {
                  modal.openModal(({ isOpen, onClose }) =>
                    createElement(InvalidPdfFileModal, {
                      isOpen,
                      onClose,
                      type: 'encrypted'
                    })
                  );
                  return;
                }
              }

              openUploadErrorDialog(
                status === 413
                  ? t('main:fillForm.template.uploadError.payloadTooLarge')
                  : t('main:fillForm.template.uploadError.unknownError')
              );
            })
            .finally(() => {
              setValidatingFiles((prev) => {
                const next = new Set(prev);
                next.delete(fileKey);
                return next;
              });
            });
        }
      }
    },
    [
      references,
      setValue,
      getValues,
      openAlertDialog,
      t,
      disabled,
      fieldName,
      shouldDirty,
      excludeImageExtensions,
      modal,
      openUploadErrorDialog
    ]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles, disabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled) return;
      setIsDragOver(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const openFileInput = useCallback(() => {
    if (disabled) return;
    fileInputRef.current?.click();
  }, [disabled]);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [handleFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      const currentFiles = references || [];
      const newFiles = currentFiles.filter((_, i) => i !== index);
      setValue(fieldName, newFiles.length > 0 ? newFiles : undefined, {
        shouldValidate: true,
        shouldDirty: shouldDirty
      });
    },
    [references, setValue, fieldName, shouldDirty]
  );

  return {
    files,
    isDragOver,
    isValidatingFiles,
    validatingFiles,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFiles,
    removeFile,
    openFileInput,
    fileInputRef,
    handleFileInputChange
  };
}
