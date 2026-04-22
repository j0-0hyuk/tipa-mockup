import { useCallback, useRef, useState } from 'react';
import { Dialog, Flex, Spinner } from '@docs-front/ui';
import { Button } from '@bichon/ds';
import {
  StyledDropzone,
  StyledMainText,
  StyledFormatText,
  StyledUploadIconWrapper
} from '@/routes/_authenticated/f/template/-components/FileDropzone/FileDropzone.style';
import { useNavigate } from '@tanstack/react-router';
import { saveFileForTemplate } from '@/utils/file/fileStorage';
import { validateHwpFile } from '@/utils/file/validateTemplate';
import { useModal } from '@/hooks/useModal';
import { useI18n } from '@/hooks/useI18n';
import { HTTPError } from 'ky';
import { StyledSupportingText } from '@/routes/_authenticated/c/-components/HwpWarningModal/HwpWarningModal.style';
import { XmlCharacterLimitModal } from '@/routes/_authenticated/c/-components/MainPrompt/XmlCharacterLimitModal';
import { InvalidXmlFileModal } from '@/routes/_authenticated/c/-components/MainPrompt/InvalidXmlFileModal';
import { InvalidPdfFileModal } from '@/routes/_authenticated/c/-components/MainPrompt/InvalidPdfFileModal';
import { postFileValidate } from '@/api/products/validate';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';
import { postTemplateFile } from '@/api/template';
import { useToast } from '@docs-front/ui';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { getAllTemplateFilesQueryOptions } from '@/query/options/products';
import { Upload } from 'lucide-react';

export interface FileDropzoneProps {
  onFileSelect?: (file: File) => void;
  onError?: (error: 'hwp' | 'unsupported' | 'filesize') => void;
  checkCreditBeforeAction?: (onConfirm?: () => void) => boolean | 'pending';
}

export default function FileDropzone({
  onFileSelect,
  onError,
  checkCreditBeforeAction
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPreValidating, setIsPreValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const modal = useModal();
  const { data: me } = useSuspenseQuery(getAccountMeQueryOptions());
  const { t } = useI18n(['main']);
  const queryClient = useQueryClient();
  const toast = useToast();

  const uploadTemplateMutation = useMutation({
    mutationFn: postTemplateFile,
    onSuccess: async (response, variables) => {
      await saveFileForTemplate({
        file: variables.documentFormat,
        metadata: {
          productFileId: response.data.productFileId
        },
        onSuccess: async () => {
          await queryClient.invalidateQueries(getAllTemplateFilesQueryOptions());
          toast.open({
            content: t('main:fillForm.template.selected'),
            duration: 3000,
            position: 'top'
          });
          onFileSelect?.(variables.documentFormat);
          const fullFileName = variables.documentFormat.name;
          navigate({
            to: '/f/prompt/$productFileId',
            params: {
              productFileId: String(response.data.productFileId)
            },
            search: {
              fileName: fullFileName
            }
          });
        },
        onError: (error) => {
          console.error('파일 저장 실패:', error);
          onFileSelect?.(variables.documentFormat);
          const fullFileName = variables.documentFormat.name;
          navigate({
            to: '/f/prompt/$productFileId',
            params: {
              productFileId: String(response.data.productFileId)
            },
            search: {
              fileName: fullFileName
            }
          });
        }
      });
    },
    onError: (error) => {
      console.error('템플릿 업로드 실패:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const isXmlError = errorMessage.includes('유효한 XML 형식이 아닙니다.');
      const isXmlCharacterLimitExceeded =
        error instanceof HTTPError &&
        error.response.status === 413 &&
        errorMessage.includes('XML character limit exceeded');

      if (isXmlCharacterLimitExceeded) {
        modal.openModal(({ isOpen, onClose }) => (
          <XmlCharacterLimitModal isOpen={isOpen} onClose={onClose} />
        ));
        onError?.('filesize');
        return;
      }

      const displayMessage = isXmlError
        ? errorMessage
        : t('main:fillForm.template.uploadError.unknownError');

      openAlertDialog(
        t('main:fillForm.template.uploadError.title'),
        <StyledSupportingText>{displayMessage}</StyledSupportingText>
      );
      onError?.('filesize');
    }
  });
  const openAlertDialog = useCallback(
    (title: string, description: React.ReactNode) => {
      modal.openModal(({ isOpen, onClose }) => (
        <Dialog isOpen={isOpen} onClose={onClose}>
          <Dialog.title>{title}</Dialog.title>
          <Dialog.content>{description}</Dialog.content>
          <Dialog.footer>
            <Button
              variant="filled"
              size="medium"
              style={{ width: '100%' }}
              onClick={onClose}
            >
              {t('main:export.drawer.alerts.confirm')}
            </Button>
          </Dialog.footer>
        </Dialog>
      ));
    },
    [modal, t]
  );

  const processFile = useCallback(
    async (file: File) => {
      const validation = validateHwpFile(file, {
        onUnsupported: () => {
          openAlertDialog(
            t('export:alerts.unsupportedFile.title'),
            <StyledSupportingText>
              {t('export:alerts.unsupportedFile.description.line1')} <br />
              <br /> {t('export:alerts.unsupportedFile.description.line2')}
            </StyledSupportingText>
          );
          onError?.('unsupported');
        },
        onFilesize: () => {
          openAlertDialog(
            t('export:alerts.fileSizeExceeded.title'),
            <StyledSupportingText>
              {t('export:alerts.fileSizeExceeded.description.line1')} <br />
              <br /> {t('export:alerts.fileSizeExceeded.description.line2')}
              <br /> {t('export:alerts.fileSizeExceeded.description.line3')}
            </StyledSupportingText>
          );
          onError?.('filesize');
        }
      });

      if (validation.isValid) {
        setIsPreValidating(true);
        try {
          await postFileValidate(file, 'EXPORT_FORMAT');
          uploadTemplateMutation.mutate({ documentFormat: file });
        } catch (error) {
          let displayMessage = t('main:fillForm.template.uploadError.unknownError');

          if (error instanceof HTTPError) {
            const status = error.response?.status;
            if (
              status === 413 &&
              error.message?.includes('XML character limit exceeded')
            ) {
              modal.openModal(({ isOpen, onClose }) => (
                <XmlCharacterLimitModal isOpen={isOpen} onClose={onClose} />
              ));
              onError?.('filesize');
              return;
            }
            if (
              status === 400 &&
              error.message === '유효한 XML 형식이 아닙니다.'
            ) {
              modal.openModal(({ isOpen, onClose }) => (
                <InvalidXmlFileModal isOpen={isOpen} onClose={onClose} />
              ));
              onError?.('unsupported');
              return;
            }
            if (
              status === 400 &&
              error.message?.includes('텍스트를 추출할 수 없는 PDF')
            ) {
              modal.openModal(({ isOpen, onClose }) => (
                <InvalidPdfFileModal
                  isOpen={isOpen}
                  onClose={onClose}
                  type="image"
                />
              ));
              onError?.('unsupported');
              return;
            }
            if (
              status === 400 &&
              error.message?.includes('has not been decrypted')
            ) {
              modal.openModal(({ isOpen, onClose }) => (
                <InvalidPdfFileModal
                  isOpen={isOpen}
                  onClose={onClose}
                  type="encrypted"
                />
              ));
              onError?.('unsupported');
              return;
            }

            if (status === 413) {
              displayMessage = t(
                'main:fillForm.template.uploadError.payloadTooLarge'
              );
            }
          }

          openAlertDialog(
            t('main:fillForm.template.uploadError.title'),
            <StyledSupportingText>{displayMessage}</StyledSupportingText>
          );
          onError?.('filesize');
        } finally {
          setIsPreValidating(false);
        }
      }
    },
    [uploadTemplateMutation, openAlertDialog, t, onError, modal]
  );

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      if (!me?.hasProAccess) return;

      const file = files[0];

      if (checkCreditBeforeAction) {
        const result = checkCreditBeforeAction(() => {
          processFile(file);
        });
        if (result === false || result === 'pending') {
          return;
        }
      }

      processFile(file);
    },
    [me, checkCreditBeforeAction, processFile]
  );

  const isDisabled =
    !me?.hasProAccess || isPreValidating || uploadTemplateMutation.isPending;

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (isDisabled) return;
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles, isDisabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (isDisabled) return;
      setIsDragOver(true);
    },
    [isDisabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = useCallback(() => {
    if (isDisabled) return;
    fileInputRef.current?.click();
  }, [isDisabled]);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [handleFiles]
  );

  return (
    <StyledDropzone
      isDragOver={isDragOver}
      disabled={isDisabled}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".hwpx,.hwp"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />
      <Flex
        direction="column"
        gap="12px"
        alignItems="center"
        justify="center"
        height="100%"
      >
        {isPreValidating || uploadTemplateMutation.isPending ? (
          <Spinner size={28} />
        ) : (
          <>
            <StyledUploadIconWrapper>
              <Upload size={24} strokeWidth={1.5} />
            </StyledUploadIconWrapper>
            <Flex direction="column" gap="4px" alignItems="center">
              <StyledMainText>
                클릭하여 파일을 선택하거나 여기로 드래그해주세요
              </StyledMainText>
              <StyledFormatText>
                hwp, hwpx 파일 (최대 30MB)
              </StyledFormatText>
            </Flex>
          </>
        )}
      </Flex>
    </StyledDropzone>
  );
}
