import { Button, Flex } from '@bichon/ds';
import { colors } from '@bichon/ds';
import {
  createFileRoute,
  Navigate,
  useNavigate
} from '@tanstack/react-router';
import { z } from 'zod';
import { createElement, useCallback, useEffect, useRef, useState } from 'react';
import { Check, File as FileIcon, Info, LoaderCircle, Upload, X } from 'lucide-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';

import {
  getProductsQueryOptions,
  getProductsFilesOptions
} from '@/query/options/products';
import { postFileValidate } from '@/api/products/validate';
import { useModal } from '@/hooks/useModal';
import { useI18n } from '@/hooks/useI18n';
import { StyledSupportingText } from '@/routes/_authenticated/c/-components/HwpWarningModal/HwpWarningModal.style';
import { InvalidXmlFileModal } from '@/routes/_authenticated/c/-components/MainPrompt/InvalidXmlFileModal';
import { InvalidPdfFileModal } from '@/routes/_authenticated/c/-components/MainPrompt/InvalidPdfFileModal';
import { XmlCharacterLimitModal } from '@/routes/_authenticated/c/-components/MainPrompt/XmlCharacterLimitModal';
import { Modal, Spinner } from '@docs-front/ui';
import { postVisualSuggestions } from '@/api/products/mutation';
import type { VisualSuggestion } from '@/routes/_authenticated/f/visual-suggestions/-components/SuggestionsTable';
import { StyledFunnelContentWrapper } from '@/routes/_authenticated/f/-route.style';
import ExistingDocumentsTable, {
  type SelectedDocumentInfo
} from '@/routes/_authenticated/f/upload/-components/ExistingDocumentsTable/ExistingDocumentsTable';
import {
  saveFileToIndexedDB,
  getFileFromIndexedDB,
  deleteFileFromIndexedDB,
  type FileMetadata
} from '@/utils/file/fileStorage';
import {
  StyledStepHeader,
  StyledTemplateName,
  StyledStepSubtitle,
  StyledInfoBanner,
  StyledSectionTitle,
  StyledUploadFooter,
  StyledDropzone,
  StyledDropzoneMainText,
  StyledDropzoneSubText,
  StyledFileList,
  StyledFileItem,
  StyledFileName,
  StyledFileSize,
  StyledSpinningIcon,
  StyledFileIcon
} from '@/routes/_authenticated/f/upload/-upload.style';

const FUNNEL_STORAGE_KEY = 'f-funnel-data';
const SUGGESTIONS_STORAGE_KEY = 'f-visual-suggestions';
const MAX_FILES = 3;
const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB
const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.hwp', '.hwpx'];

function mapVisualSuggestions(
  result: Awaited<ReturnType<typeof postVisualSuggestions>>
): VisualSuggestion[] {
  return result.map((item) => ({
    id: crypto.randomUUID(),
    title: item.name,
    prompt: item.info,
    position: item.position,
    genBy: 'ai' as const,
    selected: true
  }));
}

function validateFile(
  file: File
): { isValid: boolean; error?: 'unsupported' | 'filesize' | 'duplicate' } {
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: 'filesize' };
  }
  const fileName = file.name.toLowerCase();
  const isValidExtension = ACCEPTED_EXTENSIONS.some((ext) =>
    fileName.endsWith(ext)
  );
  if (!isValidExtension) {
    return { isValid: false, error: 'unsupported' };
  }
  return { isValid: true };
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

/** sessionStorage에서 저장된 upload 데이터 복원 */
function getSavedUploadData(productFileId: string) {
  try {
    const saved = sessionStorage.getItem(FUNNEL_STORAGE_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (parsed.context?.productFileId !== productFileId) return null;
    return parsed.context?.uploadData ?? null;
  } catch {
    return null;
  }
}

/** 프롬프트 입력 여부 확인 */
function hasPromptData(productFileId: string): boolean {
  try {
    const saved = sessionStorage.getItem(FUNNEL_STORAGE_KEY);
    if (!saved) return false;
    const parsed = JSON.parse(saved);
    if (parsed.context?.productFileId !== productFileId) return false;
    return Boolean(parsed.context?.formData?.prompt?.trim());
  } catch {
    return false;
  }
}

export const Route = createFileRoute(
  '/_authenticated/f/upload/$productFileId'
)({
  component: RouteComponent,
  validateSearch: z.object({
    fileName: z.string().optional()
  })
});

function RouteComponent() {
  const { productFileId } = Route.useParams();
  const { fileName } = Route.useSearch();
  const navigate = useNavigate();
  const templateFileId = Number(productFileId);
  const modal = useModal();
  const { t } = useI18n(['export', 'main']);

  // 양식 채우기 문서 (EXPORT)
  const { data: exportData } = useSuspenseQuery(
    getProductsFilesOptions({ page: 0, size: 100, fileType: 'EXPORT' })
  );
  const exportDocuments = exportData?.data?.exports?.content ?? [];

  // 사업계획서 초안 (products)
  const { data: products } = useSuspenseQuery(getProductsQueryOptions());

  // 파일 업로드 상태
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const referenceFileIdsRef = useRef<string[]>([]);

  // 파일 검증 상태
  const [validatingFiles, setValidatingFiles] = useState<Set<string>>(
    new Set()
  );
  const isValidatingFiles = validatingFiles.size > 0;

  // 기존 문서에서 선택된 문서
  const [selectedDocument, setSelectedDocument] =
    useState<SelectedDocumentInfo | null>(() => {
      const savedUpload = getSavedUploadData(productFileId);
      if (!savedUpload) return null;

      if (savedUpload.exportProductFileId != null) {
        const doc = exportDocuments.find(
          (d) => d.productFileId === savedUpload.exportProductFileId
        );
        if (doc) return { type: 'export', document: doc };
      }

      if (savedUpload.selectedProductId != null) {
        const product = products.find(
          (p) => p.id === savedUpload.selectedProductId
        );
        if (product) {
          return {
            type: 'draft',
            product: {
              id: product.id,
              itemName: product.itemName,
              content: savedUpload.productContents ?? ''
            }
          };
        }
      }

      return null;
    });

  // IndexedDB에서 저장된 reference 파일 복원
  useEffect(() => {
    const restoreFiles = async () => {
      const savedUpload = getSavedUploadData(productFileId);
      if (!savedUpload?.referenceFileIds?.length) return;

      const fileIds = savedUpload.referenceFileIds as string[];
      const files: File[] = [];
      for (const fileId of fileIds) {
        const result = await getFileFromIndexedDB(fileId);
        if (result) {
          files.push(result.file);
        }
      }

      if (files.length > 0) {
        referenceFileIdsRef.current = fileIds;
        setUploadedFiles(files);
      }
    };

    restoreFiles();
  }, [productFileId]);

  // 파일 변경 시 IndexedDB에 저장 + sessionStorage 업데이트
  const saveFilesToIndexedDB = useCallback(
    async (files: File[]) => {
      // 기존 파일 삭제
      for (const oldId of referenceFileIdsRef.current) {
        await deleteFileFromIndexedDB(oldId);
      }

      // 새 파일 저장
      const newFileIds: string[] = [];
      for (const file of files) {
        const metadata: FileMetadata = {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          isBlob: true
        };
        const fileId = await saveFileToIndexedDB(file, metadata);
        newFileIds.push(fileId);
      }
      referenceFileIdsRef.current = newFileIds;

      // sessionStorage 업데이트 (파일 ID만)
      try {
        const saved = sessionStorage.getItem(FUNNEL_STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : {};
        sessionStorage.setItem(
          FUNNEL_STORAGE_KEY,
          JSON.stringify({
            ...parsed,
            step: 'upload',
            context: {
              ...parsed.context,
              templateFileId: productFileId,
              uploadData: {
                ...parsed.context?.uploadData,
                referenceFileIds: newFileIds
              }
            }
          })
        );
      } catch {
        // ignore
      }
    },
    [productFileId]
  );

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
      openAlertDialog(
        t('main:fillForm.template.uploadError.title'),
        <StyledSupportingText>{message}</StyledSupportingText>
      );
    },
    [openAlertDialog, t]
  );

  const addFiles = useCallback(
    (newFiles: File[]) => {
      const currentFiles = uploadedFiles;
      const remainingSlots = MAX_FILES - currentFiles.length;
      const filesToAdd = newFiles.slice(0, remainingSlots);

      const isDuplicateFile = (file: File, existingFiles: File[]): boolean =>
        existingFiles.some(
          (existing) =>
            existing.name === file.name && existing.size === file.size
        );

      const validFiles: File[] = [];
      for (const file of filesToAdd) {
        const validation = validateFile(file);
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
        } else if (validation.error === 'filesize') {
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

      if (validFiles.length > 0) {
        const updatedFiles = [...currentFiles, ...validFiles];
        setUploadedFiles(updatedFiles);
        void saveFilesToIndexedDB(updatedFiles);

        // 백엔드 API 검증
        for (const file of validFiles) {
          const fileKey = `${file.name}-${file.size}`;
          setValidatingFiles((prev) => new Set(prev).add(fileKey));

          postFileValidate(file, 'REFERENCE')
            .catch((error) => {
              let status: number | undefined;

              // 검증 실패 시 파일 제거
              setUploadedFiles((prev) => {
                const filtered = prev.filter((f) => f !== file);
                void saveFilesToIndexedDB(filtered);
                return filtered;
              });

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
    [uploadedFiles, saveFilesToIndexedDB, openAlertDialog, openUploadErrorDialog, t, modal]
  );

  const removeFile = useCallback(
    (index: number) => {
      setUploadedFiles((prev) => {
        const next = prev.filter((_, i) => i !== index);
        void saveFilesToIndexedDB(next);
        return next;
      });
    },
    [saveFilesToIndexedDB]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      addFiles(Array.from(e.dataTransfer.files));
    },
    [addFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDropzoneClick = useCallback(() => {
    if (uploadedFiles.length >= MAX_FILES) return;
    fileInputRef.current?.click();
  }, [uploadedFiles.length]);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        addFiles(Array.from(e.target.files));
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [addFiles]
  );

  const handleDocumentUpload = useCallback(
    (info: SelectedDocumentInfo | null) => {
      setSelectedDocument(info);

      // 선택 즉시 sessionStorage에 저장
      try {
        const saved = sessionStorage.getItem(FUNNEL_STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : {};
        const uploadData: Record<string, unknown> = {
          ...parsed.context?.uploadData,
          referenceFileIds: referenceFileIdsRef.current
        };

        // 기존 선택 정보 초기화
        delete uploadData.exportProductFileId;
        delete uploadData.selectedProductId;
        delete uploadData.productContents;

        if (info?.type === 'export') {
          uploadData.exportProductFileId = info.document.productFileId;
        } else if (info?.type === 'draft') {
          uploadData.selectedProductId = info.product.id;
          uploadData.productContents = info.product.content;
        }

        sessionStorage.setItem(
          FUNNEL_STORAGE_KEY,
          JSON.stringify({
            ...parsed,
            step: 'upload',
            context: {
              ...parsed.context,
              productFileId,
              templateFileId: productFileId,
              uploadData
            }
          })
        );
      } catch {
        // ignore
      }
    },
    [productFileId]
  );

  const hasContent =
    selectedDocument !== null ||
    uploadedFiles.length > 0 ||
    hasPromptData(productFileId);

  const navigateToVisualSuggestions = useCallback(() => {
    navigate({
      to: '/f/visual-suggestions/$productFileId',
      params: { productFileId },
      search: fileName ? { fileName } : undefined
    });
  }, [productFileId, navigate, fileName]);

  const saveFunnelAndNavigate = useCallback(
    (uploadData: {
      /** 초안 선택 시: 초안 텍스트 내용 */
      productContents?: string;
      /** 초안 선택 시: 초안 product ID */
      selectedProductId?: number;
      /** EXPORT 선택 시: export product file ID (백엔드에서 텍스트 처리) */
      exportProductFileId?: number;
      /** 업로드된 파일의 IndexedDB ID 배열 */
      referenceFileIds?: string[];
    }) => {
      // 1. sessionStorage에 context 저장
      let formData: Record<string, unknown> = {};
      try {
        const saved = sessionStorage.getItem(FUNNEL_STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : {};
        formData = {
          ...parsed.context?.formData,
          productContents: uploadData.productContents ?? '',
          referenceFileIds: referenceFileIdsRef.current,
          selectedProductId: uploadData.selectedProductId,
          exportProductFileId: uploadData.exportProductFileId
        };

        sessionStorage.setItem(
          FUNNEL_STORAGE_KEY,
          JSON.stringify({
            ...parsed,
            step: 'visual-suggestions',
            context: {
              ...parsed.context,
              productFileId,
              fileName,
              formData
            }
          })
        );
      } catch {
        // ignore
      }

      // 2. 기존 suggestions가 있고 같은 productFileId이면 바로 이동
      const existingSuggestions = sessionStorage.getItem(SUGGESTIONS_STORAGE_KEY);
      if (existingSuggestions) {
        try {
          const parsed = JSON.parse(existingSuggestions);
          if (
            parsed.productFileId === productFileId &&
            Array.isArray(parsed.items) &&
            parsed.items.length > 0
          ) {
            navigateToVisualSuggestions();
            return;
          }
        } catch {
          // ignore, proceed to API call
        }
      }

      // 3. IndexedDB에서 referenceFiles 복원 후 API 호출
      const loadAndCallApi = async () => {
        const referenceFiles: File[] = [];
        for (const fileId of referenceFileIdsRef.current) {
          const result = await getFileFromIndexedDB(fileId);
          if (result) referenceFiles.push(result.file);
        }

        const apiParams: Parameters<typeof postVisualSuggestions>[0] = {
          contents: {
            templateFileId,
            userPrompt: (formData.resolvedPrompt as string) ?? (formData.prompt as string) ?? '',
            productContents: uploadData.productContents,
            exportProductFileId: uploadData.exportProductFileId
          },
          referenceFiles: referenceFiles.length > 0 ? referenceFiles : undefined
        };
        const createSuggestionsRequest = () =>
          postVisualSuggestions(apiParams).then(mapVisualSuggestions);
        const initialSuggestionsRequest = createSuggestionsRequest();

        modal.openModal(({ isOpen, onClose }) => (
          <SuggestionsLoadingModal
            isOpen={isOpen}
            onClose={onClose}
            initialSuggestionsRequest={initialSuggestionsRequest}
            createSuggestionsRequest={createSuggestionsRequest}
            onSuccess={(suggestions) => {
              sessionStorage.setItem(
                SUGGESTIONS_STORAGE_KEY,
                JSON.stringify({ productFileId, items: suggestions.slice(0, 5) })
              );
              onClose();
              navigateToVisualSuggestions();
            }}
          />
        ));
      };

      void loadAndCallApi().catch((error) => {
        console.error('Failed to load reference files or call visual suggestions API', error);
      });
    },
    [productFileId, fileName, templateFileId, modal, navigateToVisualSuggestions]
  );

  const handleNext = useCallback(() => {
    if (!hasContent) {
      modal.openModal(({ isOpen, onClose }) => (
        <Modal isOpen={isOpen} onClose={onClose}>
          <Modal.Header title="입력된 내용이 없습니다" />
          <Modal.Body>
            사업계획서 생성을 위해 프롬프트를 입력하거나, 자료를 업로드하거나,
            기존 작성 문서를 선택해주세요.
          </Modal.Body>
          <Modal.Footer>
            <Modal.ConfirmButton onClick={onClose}>확인</Modal.ConfirmButton>
          </Modal.Footer>
        </Modal>
      ));
      return;
    }

    if (selectedDocument) {
      if (selectedDocument.type === 'export') {
        saveFunnelAndNavigate({
          exportProductFileId: selectedDocument.document.productFileId
        });
      } else {
        saveFunnelAndNavigate({
          productContents: selectedDocument.product.content,
          selectedProductId: selectedDocument.product.id
        });
      }
    } else if (uploadedFiles.length > 0) {
      saveFunnelAndNavigate({});
    } else if (hasPromptData(productFileId)) {
      saveFunnelAndNavigate({});
    }
  }, [selectedDocument, uploadedFiles, saveFunnelAndNavigate, productFileId, hasContent, modal]);

  const handleBack = useCallback(() => {
    navigate({
      to: '/f/prompt/$productFileId',
      params: { productFileId },
      search: fileName ? { fileName } : undefined
    });
  }, [navigate, productFileId, fileName]);

  if (!templateFileId) {
    return <Navigate to="/f/template" />;
  }

  return (
    <Flex
      direction="column"
      width="100%"
      style={{ minHeight: '0px', flex: 1 }}
    >
      <StyledFunnelContentWrapper>
        {/* 헤더 */}
        <StyledStepHeader>
          {fileName && (
            <StyledTemplateName>&apos;{fileName}&apos;</StyledTemplateName>
          )}
          <StyledStepSubtitle>
            사업계획서 작성을 위한 자료를 업로드해주세요
          </StyledStepSubtitle>
        </StyledStepHeader>

        {/* 안내 배너 */}
        <StyledInfoBanner>
          <Info size={16} />
          <span>
            기존에 만들었던 다른 사업계획서 파일 혹은 이외 파일들을 업로드하는
            단계입니다. 단계를 건너뛸 수 있습니다.
          </span>
        </StyledInfoBanner>

        {/* 파일 업로드하기 */}
        <Flex direction="column" gap={16} width="100%">
          <StyledSectionTitle>파일 업로드하기</StyledSectionTitle>

          <StyledDropzone
            $isDragOver={isDragOver}
            $disabled={uploadedFiles.length >= MAX_FILES}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleDropzoneClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_EXTENSIONS.join(',')}
              multiple
              style={{ display: 'none' }}
              onChange={handleFileInputChange}
            />
            <Flex
              direction="column"
              gap={8}
              alignItems="center"
              justify="center"
            >
              <Upload size={24} color={colors.textTertiary} />
              <StyledDropzoneMainText>
                클릭하여 파일을 선택하거나 여기로 드래그해주세요
              </StyledDropzoneMainText>
              <StyledDropzoneSubText>
                (pdf, docx, hwp, hwpx에 한하여 30mb 이내 {MAX_FILES}개까지
                첨부 가능)
              </StyledDropzoneSubText>
            </Flex>
          </StyledDropzone>

          {uploadedFiles.length > 0 && (
            <StyledFileList>
              {uploadedFiles.map((file, index) => {
                const isValidating = validatingFiles.has(
                  `${file.name}-${file.size}`
                );
                return (
                  <StyledFileItem key={`${file.name}-${file.size}`}>
                    {isValidating ? (
                      <StyledSpinningIcon>
                        <LoaderCircle size={16} color={colors.textTertiary} />
                      </StyledSpinningIcon>
                    ) : (
                      <StyledFileIcon>
                        <FileIcon size={16} color={colors.textTertiary} />
                      </StyledFileIcon>
                    )}
                    <StyledFileName>{file.name}</StyledFileName>
                    <StyledFileSize>{formatFileSize(file.size)}</StyledFileSize>
                    <Button
                      type="button"
                      variant="text"
                      size="small"
                      onClick={() => removeFile(index)}
                    >
                      <X size={16} color={colors.textSecondary} />
                    </Button>
                  </StyledFileItem>
                );
              })}
            </StyledFileList>
          )}
        </Flex>

        {/* 기존 작성 문서 불러오기 */}
        <Flex direction="column" gap={16} width="100%">
          <StyledSectionTitle>기존 작성 문서 불러오기</StyledSectionTitle>
          <ExistingDocumentsTable
            exportDocuments={exportDocuments}
            draftProducts={products}
            selectedDocument={selectedDocument}
            onUpload={handleDocumentUpload}
          />
        </Flex>
      </StyledFunnelContentWrapper>

      {/* 푸터 */}
      <StyledUploadFooter>
        <Button
          type="button"
          variant="outlined"
          size="large"
          onClick={handleBack}
        >
          이전
        </Button>
        <Flex gap={12} style={{ marginLeft: 'auto' }}>
          <Button
            type="button"
            variant="filled"
            size="large"
            onClick={handleNext}
            disabled={isValidatingFiles}
          >
            다음 단계
          </Button>
        </Flex>
      </StyledUploadFooter>
    </Flex>
  );
}

const LOADING_STEPS = [
  '양식 분석',
  '자료 분석',
  '이미지 리스트 생성',
  '완료'
] as const;

function getRandomDelay() {
  return 1500 + Math.random() * 2000;
}

function SuggestionsLoadingModal({
  isOpen,
  onClose,
  initialSuggestionsRequest,
  createSuggestionsRequest,
  onSuccess
}: {
  isOpen: boolean;
  onClose: () => void;
  initialSuggestionsRequest: Promise<VisualSuggestion[]>;
  createSuggestionsRequest: () => Promise<VisualSuggestion[]>;
  onSuccess: (suggestions: VisualSuggestion[]) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [request, setRequest] = useState(initialSuggestionsRequest);
  const onSuccessRef = useRef(onSuccess);
  const apiDoneRef = useRef(false);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  // 단계별 타이머 (1~2단계만 타이머, 3단계는 API 완료 시 처리)
  useEffect(() => {
    setCompletedSteps(0);
    apiDoneRef.current = false;

    const timers: ReturnType<typeof setTimeout>[] = [];
    let cumulative = 0;

    for (let step = 1; step <= 2; step++) {
      cumulative += getRandomDelay();
      timers.push(
        setTimeout(() => {
          setCompletedSteps(step);
        }, cumulative)
      );
    }

    return () => timers.forEach(clearTimeout);
  }, [request]);

  // API 호출
  useEffect(() => {
    let isActive = true;
    setError(null);
    apiDoneRef.current = false;

    void request
      .then((suggestions) => {
        if (!isActive) return;
        apiDoneRef.current = true;
        // API 완료 → 3단계(이미지 리스트 생성) 체크 → 잠시 후 4단계(완료) 체크 → 이동
        setCompletedSteps(3);
        setTimeout(() => {
          setCompletedSteps(4);
          setTimeout(() => onSuccessRef.current(suggestions), 500);
        }, 400);
      })
      .catch((err) => {
        if (!isActive) return;
        setError(
          err instanceof Error
            ? err.message
            : '시각 자료 추천 생성에 실패했습니다.'
        );
      });

    return () => {
      isActive = false;
    };
  }, [request]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Body>
        <Flex
          direction="column"
          alignItems="center"
          justify="center"
          gap={24}
          padding="40px 24px"
        >
          {!error && (
            <>
              <Spinner size={48} />
              <Flex direction="column" alignItems="center" gap={8}>
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: colors.textPrimary
                  }}
                >
                  시각 자료를 구성하고 있습니다
                </span>
                <span
                  style={{
                    fontSize: 14,
                    color: colors.textTertiary,
                    textAlign: 'center',
                    lineHeight: '1.5'
                  }}
                >
                  양식과 프롬프트를 분석하여
                  <br />
                  사업계획서에 필요한 이미지 리스트를 생성 중입니다.
                </span>
              </Flex>
              <Flex
                direction="column"
                gap={16}
                width="100%"
                style={{ maxWidth: 320, marginTop: 8 }}
              >
                {LOADING_STEPS.map((label, i) => {
                  const isDone = completedSteps > i;
                  const isActive = completedSteps === i;
                  const isLastStep = i === LOADING_STEPS.length - 1;
                  const displayLabel = isActive && !isLastStep ? `${label} 중...` : label;
                  return (
                    <Flex key={label} gap={12} alignItems="center">
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: isDone
                            ? colors.bgAccent
                            : 'transparent',
                          border: isDone
                            ? 'none'
                            : `2px solid ${colors.lineDefault}`,
                          flexShrink: 0
                        }}
                      >
                        {isDone && (
                          <Check
                            size={12}
                            strokeWidth={3}
                            color={colors.bgWhite}
                          />
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: isDone || isActive ? 500 : 400,
                          color: isDone || isActive
                            ? colors.textPrimary
                            : colors.textTertiary
                        }}
                      >
                        {displayLabel}
                      </span>
                    </Flex>
                  );
                })}
              </Flex>
            </>
          )}
          {error && (
            <>
              <span style={{ color: colors.basic.red[500] }}>{error}</span>
              <Button
                type="button"
                variant="outlined"
                size="medium"
                onClick={() => {
                  setRequest(createSuggestionsRequest());
                }}
              >
                다시 시도
              </Button>
            </>
          )}
        </Flex>
      </Modal.Body>
      {error && (
        <Modal.Footer>
          <Modal.CancelButton onClick={onClose}>닫기</Modal.CancelButton>
        </Modal.Footer>
      )}
    </Modal>
  );
}
