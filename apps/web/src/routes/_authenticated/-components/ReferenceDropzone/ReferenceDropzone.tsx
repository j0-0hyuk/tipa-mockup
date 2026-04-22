import { useCallback, useRef, useState } from 'react';
import { Upload, File, X, Plus, Image } from 'lucide-react';
import { Flex, Modal } from '@docs-front/ui';
import { useFormContext } from 'react-hook-form';
import {
  StyledReferenceDropzone,
  StyledDropzoneContent,
  StyledIconWrapper,
  StyledMainText,
  StyledFormatText,
  StyledFileList,
  StyledFileItem,
  StyledFileName,
  StyledAddFileButton,
  StyledAddFileButtonText
} from '@/routes/_authenticated/-components/ReferenceDropzone/ReferenceDropzone.style';
import { useModal } from '@/hooks/useModal';
import { useI18n } from '@/hooks/useI18n';
import { StyledSupportingText } from '@/routes/_authenticated/c/-components/HwpWarningModal/HwpWarningModal.style';
import { useTheme } from '@emotion/react';

const MAX_FILES = 3;
const MAX_FILE_SIZE = 30 * 1024 * 1024;

const SUPPORTED_EXTENSIONS = ['.pdf', '.docx', '.hwp', '.hwpx', '.png'];
const SUPPORTED_EXTENSIONS_WITHOUT_IMAGE = ['.pdf', '.docx', '.hwp', '.hwpx'];

const IMAGE_EXTENSIONS = ['.png'];

function isImageFile(fileName: string | undefined): boolean {
  if (!fileName) return false;
  const lowerFileName = fileName.toLowerCase();
  return IMAGE_EXTENSIONS.some((ext) => lowerFileName.endsWith(ext));
}

function validateReferenceFile(
  file: File,
  excludeImageExtensions: boolean = false
): {
  isValid: boolean;
  error?: 'unsupported' | 'filesize';
} {
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

interface ReferenceDropzoneProps {
  disabled?: boolean;
  fieldName?: string;
  shouldDirty?: boolean;
  excludeImageExtensions?: boolean;
}

export default function ReferenceDropzone({
  disabled = false,
  fieldName = 'references',
  shouldDirty = false,
  excludeImageExtensions = false
}: ReferenceDropzoneProps) {
  const theme = useTheme();
  const { setValue, watch } =
    useFormContext<Record<string, File[] | undefined>>();
  const references = watch(fieldName);
  const files = references || [];
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modal = useModal();
  const { t } = useI18n(['export', 'main']);

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

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles || newFiles.length === 0) return;
      if (disabled) return;

      const currentFiles = references || [];
      const fileArray = Array.from(newFiles);
      const remainingSlots = MAX_FILES - currentFiles.length;
      const filesToAdd = fileArray.slice(0, remainingSlots);

      const isDuplicateFile = (file: File, existingFiles: File[]): boolean => {
        return existingFiles.some(
          (existingFile) =>
            existingFile.name === file.name && existingFile.size === file.size
        );
      };

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
        setValue(fieldName, [...currentFiles, ...validFiles], {
          shouldValidate: true,
          shouldDirty: shouldDirty
        });
      }
    },
    [
      references,
      setValue,
      openAlertDialog,
      t,
      disabled,
      fieldName,
      shouldDirty,
      excludeImageExtensions
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

  const handleClick = useCallback(() => {
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

  const handleAddFileClick = useCallback(() => {
    if (disabled) return;
    const currentFiles = references || [];
    if (currentFiles.length >= MAX_FILES) return;
    fileInputRef.current?.click();
  }, [references, disabled]);

  if (files.length === 0) {
    return (
      <StyledReferenceDropzone
        isDragOver={isDragOver}
        disabled={disabled}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        $isDashed
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={
            excludeImageExtensions
              ? '.pdf,.docx,.hwp,.hwpx'
              : '.pdf,.docx,.hwp,.hwpx,.png'
          }
          multiple
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
        />
        <StyledDropzoneContent>
          <StyledIconWrapper>
            <Upload size={24} />
          </StyledIconWrapper>
          <StyledMainText>
            {t('main:fillForm.prompt.references.dropzone.mainText')}
          </StyledMainText>
          <StyledFormatText>
            {t('main:fillForm.prompt.references.dropzone.formatText')}
            <br />
            {t('main:fillForm.prompt.references.dropzone.sizeText')}
          </StyledFormatText>
        </StyledDropzoneContent>
      </StyledReferenceDropzone>
    );
  }

  return (
    <StyledReferenceDropzone
      as="div"
      isDragOver={false}
      disabled={disabled}
      $isDashed={false}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={
          excludeImageExtensions
            ? '.pdf,.docx,.hwp,.hwpx'
            : '.pdf,.docx,.hwp,.hwpx,.png'
        }
        multiple
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />
      <StyledFileList>
        {files.map((file, index) => (
          <StyledFileItem key={`${file.name || `file-${index}`}-${index}`}>
            {isImageFile(file.name) ? <Image size={20} /> : <File size={20} />}
            <StyledFileName>{file.name || 'Unknown file'}</StyledFileName>
            <button
              type="button"
              onClick={() => !disabled && removeFile(index)}
              disabled={disabled}
              style={{
                background: 'none',
                border: 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                opacity: disabled ? 0.5 : 1
              }}
            >
              <X size={20} />
            </button>
          </StyledFileItem>
        ))}
      </StyledFileList>
      {files.length < MAX_FILES && (
        <Flex
          padding="6px"
          justify="center"
          alignItems="center"
          onClick={handleAddFileClick}
          style={{
            cursor: disabled ? 'not-allowed' : 'pointer',
            backgroundColor: theme.color.bgBlueGray,
            opacity: disabled ? 0.5 : 1
          }}
        >
          <StyledAddFileButton type="button" disabled={disabled}>
            <Plus size={16} />
            <StyledAddFileButtonText>
              {t('main:fillForm.prompt.references.addFile')}
            </StyledAddFileButtonText>
          </StyledAddFileButton>
        </Flex>
      )}
    </StyledReferenceDropzone>
  );
}
