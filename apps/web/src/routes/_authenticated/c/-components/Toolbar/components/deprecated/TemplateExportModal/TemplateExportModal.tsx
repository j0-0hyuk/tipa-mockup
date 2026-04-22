import {
  deleteProductFile,
  postExportProduct,
  postProductFormat
} from '@/api/products/mutation';
import { Flex, Tooltip } from '@docs-front/ui';
import { useToast } from '@docs-front/ui';
import { useI18n } from '@/hooks/useI18n';
import { useModal } from '@/hooks/useModal';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { InsufficientCreditProductExportModal } from '@/routes/_authenticated/credit-plan/-components/InsufficientCreditModal/InsufficientCreditProductExportModal';
import {
  StyledError,
  StyledSupportingText
} from '@/routes/_authenticated/c/-components/HwpWarningModal/HwpWarningModal.style';
import {
  exportDrawerFormSchema,
  type ExportDrawerForm
} from '@/schema/main/exportDrawer';
import { Modal } from '@docs-front/ui';
import { getProductFilesQueryOptions } from '@/query/options/products';
import type {
  PostExportProductRequestParams,
  PostProductFormatRequestParams
} from '@/schema/api/products/export';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';
import { useMatchRoute } from '@tanstack/react-router';
import { HTTPError } from 'ky';
import {
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from 'react';
import { Form, useForm } from 'react-hook-form';
import { FormField, RadioButton } from '@docs-front/ui';
import type { GetProductResponse } from '@/schema/api/products/products';
import { captureByIds } from '@/markdown/utils/capture';
import {
  StyledRadioContainer,
  StyledRadioContainerGroup,
  StyledRadioLabel,
  StyledSectionLabel
} from '@/routes/_authenticated/c/-components/Toolbar/components/ExportModal/ExportModal.style';
import ExportTemplateSection from '@/routes/_authenticated/c/-components/Toolbar/components/deprecated/TemplateExportModal/components/ExportTemplateSection/ExportTemplateSection';
import ExportFailedModal from '@/routes/_authenticated/c/-components/Toolbar/components/deprecated/TemplateExportModal/components/ExportFailedModal/ExportFailedModal';

interface ExportTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: GetProductResponse;
}

export default function ExportTemplateModal({
  isOpen,
  onClose,
  product
}: ExportTemplateModalProps) {
  const queryClient = useQueryClient();
  const matchRoute = useMatchRoute();
  const params = matchRoute({ to: '/c/$productId' });
  if (!params) {
    throw new Error('params is not found');
  }
  const productId = Number(params.productId);
  const { t } = useI18n(['main']);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const postProductFormatMutatioFn = useCallback(
    ({ documentFormat }: PostProductFormatRequestParams) =>
      postProductFormat(productId, {
        documentFormat
      }),
    [productId]
  );

  const postExportProductMutatioFn = useCallback(
    ({
      productFilePathMapId,
      language,
      productExportedImages
    }: PostExportProductRequestParams) =>
      postExportProduct(productId, {
        productFilePathMapId,
        language,
        productExportedContent: product.content ?? '',
        productExportedImages
      }),
    [productId, product]
  );

  const postProductFormatMutation = useMutation({
    mutationFn: postProductFormatMutatioFn,
    onSuccess: () => {
      queryClient.invalidateQueries(
        getProductFilesQueryOptions(productId, {
          filter: 'FORMAT'
        })
      );
    },
    onError: async (error: Error) => {
      if (
        error instanceof HTTPError &&
        error.message === '유효한 XML 형식이 아닙니다.'
      ) {
        openAlertDialog(
          t('export:alerts.invalidXml.title'),
          <StyledSupportingText>
            {t('export:alerts.invalidXml.description.line1')} <br />
            <br />
            <StyledError>
              {t('export:alerts.invalidXml.description.line2')}
            </StyledError>
            <br />
            1. {t('export:alerts.invalidXml.description.steps.step1')}
            <br />
            2. {t('export:alerts.invalidXml.description.steps.step2')}
            <br />
            3. {t('export:alerts.invalidXml.description.steps.step3')}
            <br />
            4. {t('export:alerts.invalidXml.description.steps.step4')}
            <br />
            <br />
            <StyledError>
              {t('export:alerts.invalidXml.guideToConvert')}
            </StyledError>
            <br />
            <a
              href="https://www.polarisofficetools.com/hwp/convert/hwpx"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#3182F7', textDecoration: 'underline' }}
            >
              {t('export:alerts.invalidXml.convertLinkText')}
            </a>
          </StyledSupportingText>
        );
      }
    }
  });

  const toast = useToast();

  const postExportProductMutation = useMutation({
    mutationFn: postExportProductMutatioFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries(
        getProductFilesQueryOptions(productId, {
          filter: 'EXPORT'
        })
      );
      await queryClient.invalidateQueries(getAccountMeQueryOptions());
      toast.open({
        content: t('main:export.drawer.toast.exportStarted'),
        duration: 3000
      });
      onClose();
    },
    onError: () => {
      onClose();
      setTimeout(() => {
        modal.openModal(({ isOpen, onClose }) => (
          <ExportFailedModal isOpen={isOpen} onClose={onClose} />
        ));
      }, 0);
    }
  });

  const deleteProductFileMutatioFn = useCallback(
    (productFilePathMapId: number) =>
      deleteProductFile(productId, productFilePathMapId),
    [productId]
  );

  const deleteProductFileMutation = useMutation({
    mutationFn: deleteProductFileMutatioFn,
    onSuccess: async (_, productFilePathMapId) => {
      await queryClient.invalidateQueries(
        getProductFilesQueryOptions(productId, {
          filter: 'FORMAT'
        })
      );

      if (
        form.getValues('productFilePathMapId') ===
        productFilePathMapId.toString()
      ) {
        form.setValue('productFilePathMapId', null);
      }
    }
  });

  const { data: me } = useSuspenseQuery(getAccountMeQueryOptions());

  const modal = useModal();

  const openAlertDialog = useCallback(
    (title: string, description: ReactNode) => {
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

  const handleFileUpload = useCallback(
    (file: File) => {
      const hangulTypes = [
        'application/vnd.hancom.hwp',
        'application/haansofthwp',
        'application/x-hwp'
      ];

      const isHwpx = file.name.endsWith('.hwpx');
      const isHwp =
        hangulTypes.includes(file.type) || file.name.endsWith('.hwp');
      // const isDocx = file.name.endsWith('.docx');

      if (!isHwpx && !isHwp) {
        openAlertDialog(
          t('export:alerts.unsupportedFile.title'),
          <StyledSupportingText>
            {t('export:alerts.unsupportedFile.description.line1')} <br />
            <br /> {t('export:alerts.unsupportedFile.description.line2')}
          </StyledSupportingText>
        );
        return;
      }

      postProductFormatMutation.mutate({ documentFormat: file });
    },
    [postProductFormatMutation, openAlertDialog, t]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }

      e.dataTransfer.clearData();
    },
    [handleFileUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDropZoneClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileUpload(files[0]);
      }

      e.target.value = '';
    },
    [handleFileUpload]
  );

  const form = useForm({
    resolver: zodResolver(exportDrawerFormSchema),
    defaultValues: {
      language: null,
      productFilePathMapId: null,
      productExportedContent: '#임시'
      //   productExportedImages: files
    }
  });

  const onSubmit = useCallback(
    async (data: ExportDrawerForm) => {
      if (!me.hasProAccess) {
        const totalCredit = me.freeCredit + me.paidCredit;
        if (totalCredit < me.productExportCredit) {
          modal.openModal(({ isOpen, onClose }) => (
            <InsufficientCreditProductExportModal
              isOpen={isOpen}
              onClose={onClose}
              totalCredit={totalCredit}
              productExportCredit={me.productExportCredit}
            />
          ));
          return;
        }
      }
      const rootEl = document.getElementById('markdown-canvas');
      if (!rootEl) return;

      const ids = Array.from(rootEl.querySelectorAll('[data-docx-id]'))
        .map((el) => el.getAttribute('data-docx-id')!)
        .filter(Boolean);

      const imagesMap = await captureByIds(rootEl, ids);

      const files = await Promise.all(
        Array.from(imagesMap.entries()).map(async ([id, { capture, info }]) => {
          const blob = await (await fetch(capture.dataUrl)).blob();
          const file = new File([blob], `${id}.${capture.format}`, {
            type: blob.type
          });
          return {
            name: `${id}.${capture.format}`,
            info: info ?? '',
            binaryData: file
          };
        })
      );

      const newData = {
        ...data,
        productExportedImages: files
      };

      postExportProductMutation.mutate(newData);
    },
    [me, postExportProductMutation, modal]
  );

  const selectedProductFilePathMapId = form.watch('productFilePathMapId');
  const selectedLanguage = form.watch('language');

  const isDisabled = useMemo(() => {
    return (
      !selectedProductFilePathMapId ||
      !selectedLanguage ||
      postExportProductMutation.isPending ||
      me.hasLowCreditProductProcess
    );
  }, [
    selectedProductFilePathMapId,
    postExportProductMutation.isPending,
    selectedLanguage,
    me.hasLowCreditProductProcess
  ]);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header title={'양식에 맞춰 내보내기'} />
      <Modal.Body>
        <Form control={form.control}>
          <Flex
            direction="column"
            gap={20}
            padding={'10px 5px 0 5px'}
            flex="1 0 0"
            alignItems="flex-start"
            alignSelf="stretch"
          >
            <Suspense fallback={null}>
              <ExportTemplateSection
                productId={productId}
                control={form.control}
                deleteProductFileMutation={deleteProductFileMutation}
                isDragOver={isDragOver}
                fileInputRef={fileInputRef}
                handleDrop={handleDrop}
                handleDragOver={handleDragOver}
                handleDragLeave={handleDragLeave}
                handleDropZoneClick={handleDropZoneClick}
                handleFileInputChange={handleFileInputChange}
              />
            </Suspense>

            {selectedProductFilePathMapId && (
              <Flex
                direction="column"
                alignItems="flex-start"
                gap={8}
                alignSelf="stretch"
              >
                <StyledSectionLabel>
                  2. {t('main:export.drawer.language.label')}
                </StyledSectionLabel>
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <RadioGroupPrimitive.Root
                      {...field}
                      asChild
                      onValueChange={field.onChange}
                    >
                      <StyledRadioContainerGroup>
                        <RadioGroupPrimitive.Item value="ko" asChild>
                          <StyledRadioContainer>
                            <RadioButton />
                            <StyledRadioLabel>
                              {t('main:export.drawer.language.options.ko')}
                            </StyledRadioLabel>
                          </StyledRadioContainer>
                        </RadioGroupPrimitive.Item>
                        <RadioGroupPrimitive.Item value="en" asChild>
                          <StyledRadioContainer>
                            <RadioButton />
                            <StyledRadioLabel>
                              {t('main:export.drawer.language.options.en')}
                            </StyledRadioLabel>
                          </StyledRadioContainer>
                        </RadioGroupPrimitive.Item>
                      </StyledRadioContainerGroup>
                    </RadioGroupPrimitive.Root>
                  )}
                />
              </Flex>
            )}
          </Flex>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Tooltip
          content={
            me.hasLowCreditProductProcess && me.hasProAccess
              ? t('mainPrompt.calculatingCredit')
              : ''
          }
        >
          <Modal.ConfirmButton
            disabled={isDisabled}
            onClick={() => onSubmit(form.getValues())}
          >
            {t('common:button.export')}
          </Modal.ConfirmButton>
        </Tooltip>
      </Modal.Footer>
    </Modal>
  );
}
