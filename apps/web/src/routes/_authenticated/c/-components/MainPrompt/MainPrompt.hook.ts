import {
  createElement,
  useCallback,
  useEffect,
  useState,
  type DragEvent
} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { Button, Dialog, Flex, useToast } from '@docs-front/ui';
import { useModal } from '@/hooks/useModal';
import { useI18n } from '@/hooks/useI18n';
import {
  detailInputFormSchema,
  type DetailInputForm
} from '@/schema/main/detailInput';
import { onboardingFormToUIMessage } from '@/ai/utils';
import { postProductChatMessages, postProducts } from '@/api/products/mutation';
import { getProductsQueryOptions } from '@/query/options/products';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { useSideNavigation } from '@/routes/_authenticated/-components/SideNavigation/useSideNavigation';
import { useHwpWarningModal } from '@/routes/_authenticated/c/-components/HwpWarningModal/useHwpWarningModal';
import { DailyLimitExceededModal } from '@/routes/_authenticated/credit-plan/-components/InsufficientCreditModal/DailyLimitExceededModal';
import { FreeTrialExhaustedModal } from '@/routes/_authenticated/credit-plan/-components/InsufficientCreditModal/FreeTrialExhaustedModal';
import { AllCreditsExhaustedModal } from '@/routes/_authenticated/credit-plan/-components/InsufficientCreditModal/AllCreditsExhaustedModal';
import { InvalidXmlFileModal } from '@/routes/_authenticated/c/-components/MainPrompt/InvalidXmlFileModal';
import { InvalidPdfFileModal } from '@/routes/_authenticated/c/-components/MainPrompt/InvalidPdfFileModal';
import { XmlCharacterLimitModal } from '@/routes/_authenticated/c/-components/MainPrompt/XmlCharacterLimitModal';
import { postFileValidate } from '@/api/products/validate';
import { StyledSupportingText } from '@/routes/_authenticated/c/-components/HwpWarningModal/HwpWarningModal.style';

export function useMainPrompt() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const modal = useModal();
  const toast = useToast();
  const { t } = useI18n(['main']);
  const { setOpen } = useSideNavigation();
  const [isDragOver, setIsDragOver] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [validatingFiles, setValidatingFiles] = useState<Set<File>>(new Set());
  const { isOpen, warningType, closeModal, validateFile } =
    useHwpWarningModal();
  const { data: me } = useSuspenseQuery(getAccountMeQueryOptions());

  const form = useForm<DetailInputForm>({
    resolver: zodResolver(detailInputFormSchema),
    defaultValues: {
      itemDescription: '',
      files: []
    },
    mode: 'onChange'
  });

  const files = form.watch('files') || [];
  const isValidatingFiles = validatingFiles.size > 0;

  const openUploadErrorDialog = useCallback(
    (message: string) => {
      modal.openModal(({ isOpen, onClose }) =>
        createElement(
          Dialog,
          { isOpen, onClose },
          createElement(
            Dialog.title,
            null,
            t('main:fillForm.template.uploadError.title')
          ),
          createElement(
            Dialog.content,
            null,
            createElement(StyledSupportingText, null, message)
          ),
          createElement(
            Dialog.footer,
            null,
            createElement(
              Flex,
              { direction: 'row', width: '100%', justify: 'flex-end' },
              createElement(
                Button,
                { variant: 'outlined', size: 'medium', onClick: onClose },
                t('main:export.drawer.alerts.confirm')
              )
            )
          )
        )
      );
    },
    [modal, t]
  );

  const handleFiles = useCallback(
    (newFiles: File[]) => {
      const currentFiles = form.getValues('files') || [];
      const remainingSlots = 3 - currentFiles.length;
      const validFiles = newFiles.filter(validateFile).slice(0, remainingSlots);

      if (validFiles.length > 0) {
        const updatedFiles = [...currentFiles, ...validFiles];
        form.setValue('files', updatedFiles, {
          shouldValidate: true
        });

        for (const file of validFiles) {
          setValidatingFiles((prev) => new Set(prev).add(file));

          postFileValidate(file, 'REFERENCE')
            .catch((error) => {
              let status: number | undefined;
              const current = form.getValues('files') || [];
              form.setValue(
                'files',
                current.filter((f) => f !== file),
                { shouldValidate: true }
              );

              if (error instanceof HTTPError) {
                status = error.response?.status;
                if (
                  status === 413 &&
                  error.message?.includes('XML character limit exceeded')
                ) {
                  modal.openModal(({ isOpen: modalOpen, onClose }) =>
                    createElement(XmlCharacterLimitModal, {
                      isOpen: modalOpen,
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
                  modal.openModal(({ isOpen: modalOpen, onClose }) =>
                    createElement(InvalidXmlFileModal, {
                      isOpen: modalOpen,
                      onClose
                    })
                  );
                  return;
                }
                if (
                  status === 400 &&
                  error.message?.includes('텍스트를 추출할 수 없는 PDF')
                ) {
                  modal.openModal(({ isOpen: modalOpen, onClose }) =>
                    createElement(InvalidPdfFileModal, {
                      isOpen: modalOpen,
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
                  modal.openModal(({ isOpen: modalOpen, onClose }) =>
                    createElement(InvalidPdfFileModal, {
                      isOpen: modalOpen,
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
                next.delete(file);
                return next;
              });
            });
        }
      }
    },
    [form, modal, openUploadErrorDialog, t, validateFile]
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFiles(Array.from(e.dataTransfer.files));
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleRemoveFile = useCallback(
    (index: number) => {
      const currentFiles = form.getValues('files') || [];
      form.setValue(
        'files',
        currentFiles.filter((_, fileIndex) => fileIndex !== index),
        { shouldValidate: true }
      );
    },
    [form]
  );

  const handleAddFile = useCallback(() => {
    if (files.length >= 3) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.hwpx,.hwp,.docx,.pdf';
    input.multiple = true;
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        handleFiles(Array.from(target.files));
      }
    };
    input.click();
  }, [files.length, handleFiles]);

  const postProductsMutation = useMutation({
    mutationFn: postProducts,
    onSuccess: async () => {
      await queryClient.invalidateQueries(getAccountMeQueryOptions());
      setOpen(false);
    },
    onError: (error: HTTPError) => {
      const status = error.response?.status;
      if (status === 400) {
        if (error.message === '유효한 XML 형식이 아닙니다.') {
          modal.openModal(({ isOpen: modalOpen, onClose }) =>
            createElement(InvalidXmlFileModal, {
              isOpen: modalOpen,
              onClose
            })
          );
          return;
        }

        if (
          error.message ===
          '무료 이용 한도를 초과했습니다. 구독 후 무제한으로 이용하세요.'
        ) {
          modal.openModal(({ isOpen: modalOpen, onClose }) =>
            createElement(FreeTrialExhaustedModal, {
              isOpen: modalOpen,
              onClose
            })
          );
          return;
        }

        if (
          me?.hasProAccess &&
          (me?.freeCredit ?? 0) < (me?.productCreationCredit ?? 0) &&
          (me?.paidCredit ?? 0) <= 0
        ) {
          modal.openModal(({ isOpen: modalOpen, onClose }) =>
            createElement(AllCreditsExhaustedModal, {
              isOpen: modalOpen,
              onClose
            })
          );
          return;
        }

      }

      if (status === 413) {
        if (error.message?.includes('XML character limit exceeded')) {
          modal.openModal(({ isOpen: modalOpen, onClose }) =>
            createElement(XmlCharacterLimitModal, {
              isOpen: modalOpen,
              onClose,
              showPdfConversion: true
            })
          );
          return;
        }

        toast.open({
          content: t('main:mainPrompt.toast.referenceFileTooLarge'),
          duration: 4000
        });
        return;
      }

      toast.open({
        content: t('main:mainPrompt.toast.genericError'),
        duration: 4000
      });
    }
  });

  const { mutateAsync: postChatMessagesMutateAsync } = useMutation({
    mutationFn: ({
      chatMessage,
      productId
    }: {
      chatMessage: string[];
      productId: number;
    }) => postProductChatMessages(productId, { chatMessage })
  });

  const proceedWithRequest = useCallback(
    async (formData: DetailInputForm) => {
      if (!me) return;

      const productId = await postProductsMutation.mutateAsync(formData);
      await postChatMessagesMutateAsync({
        chatMessage: onboardingFormToUIMessage(formData).map((message) =>
          JSON.stringify(message)
        ),
        productId
      });

      setLoadingProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 500));

      void queryClient.invalidateQueries(getProductsQueryOptions());
      navigate({
        to: '/c/$productId',
        params: { productId: productId.toString() }
      });
    },
    [
      me,
      navigate,
      postChatMessagesMutateAsync,
      postProductsMutation,
      queryClient
    ]
  );

  const checkCreditAndProceed = useCallback(
    (formData: DetailInputForm) => {
      if (!me) return;

      if (me.hasProAccess && me.freeCredit < me.productCreationCredit) {
        if (me.paidCredit <= 0) {
          modal.openModal(({ isOpen: modalOpen, onClose }) =>
            createElement(AllCreditsExhaustedModal, {
              isOpen: modalOpen,
              onClose
            })
          );
          return;
        }

        modal.openModal(({ isOpen: modalOpen, onClose }) =>
          createElement(DailyLimitExceededModal, {
            isOpen: modalOpen,
            onClose,
            paidCredit: me.paidCredit,
            onConfirm:
              me.paidCredit > 0
                ? () => {
                    void proceedWithRequest(formData);
                  }
                : undefined
          })
        );
        return;
      }

      void proceedWithRequest(formData);
    },
    [me, modal, proceedWithRequest]
  );

  const handleSubmit = useCallback(
    (formData: DetailInputForm) => {
      if (isValidatingFiles) return;
      checkCreditAndProceed(formData);
    },
    [checkCreditAndProceed, isValidatingFiles]
  );

  const isPending = postProductsMutation.isPending;
  const isProcessing = isPending || loadingProgress > 0;

  useEffect(() => {
    if (!isProcessing) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '문서 생성 중입니다. 페이지를 나가시겠습니까?';
      return '문서 생성 중입니다. 페이지를 나가시겠습니까?';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isProcessing]);

  useEffect(() => {
    if (!isProcessing && loadingProgress === 100) {
      setLoadingProgress(0);
    }
  }, [isProcessing, loadingProgress]);

  return {
    me,
    form,
    files,
    isDragOver,
    isPending,
    isProcessing,
    loadingProgress,
    isValidatingFiles,
    validatingFiles,
    isHwpWarningOpen: isOpen,
    hwpWarningType: warningType,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleRemoveFile,
    handleAddFile,
    handleSubmit,
    closeHwpWarning: closeModal
  };
}
