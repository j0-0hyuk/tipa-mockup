import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Flex, useToast } from '@bichon/ds';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  PageHeader,
  PageTitle,
  PageDescription,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  EmptyState,
  PaginationContainer,
  PageButton,
  PageEllipsis,
  DeleteButton,
  LinkCell,
  TruncatedText,
  TextInput,
  TextArea,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalForm,
  ModalFooter,
  CancelButton,
  SubmitButton,
  FormSection,
  Label,
  ErrorMessage,
  HelpText
} from '@/routes/_authenticated/template/template.style';
import { SearchContainer, SearchWrapper, TabContainer, Tab, TabCount, StatusBadge, OrderCell, DeadlineText, DownloadableFileName, HiddenFileInput, ActionCellWrapper, ActionButton, ActionMenu, ActionMenuItem } from '@/routes/_authenticated/template-list/template-list.style';
import { getProductFiles, deleteTemplateFormat, updateTemplateMeta, reorderTemplate, replaceTemplateFile, downloadTemplateFile } from '@/api/authenticated/products';
import { useState, useMemo, useDeferredValue, useEffect, useRef, useCallback } from 'react';
import type { TemplateFileContents, ProductFileContents } from '@/schema/api/products/getTemplates';
import { updateTemplateMetaSchema, type UpdateTemplateMetaFormData } from '@/schema/api/products/updateTemplateMeta';
import { PasswordGuard } from '@/components/PasswordGuard/PasswordGuard';

type FileTabType = 'templates' | 'formats' | 'exports';

export const Route = createFileRoute('/_authenticated/template-list')({
  component: TemplateListPage,
});

// 파일 경로에서 파일명 추출
const parseFileName = (filePath: string | null): string => {
  if (!filePath) return '-';
  const parts = filePath.split('/');
  return parts[parts.length - 1] || filePath;
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};


function TemplateListPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FileTabType>('templates');
  const [editingTemplate, setEditingTemplate] = useState<TemplateFileContents | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [editingOrderValue, setEditingOrderValue] = useState<string>('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const replaceTargetIdRef = useRef<number | null>(null);

  const pageSize = 10;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<UpdateTemplateMetaFormData>({
    resolver: zodResolver(updateTemplateMetaSchema),
    defaultValues: {
      templateViewerUrl: '',
      postingUrl: '',
      templatePrompt: '',
      templateMarkdown: '',
      organizingAgency: '',
      deadline: ''
    }
  });

  useEffect(() => {
    if (editingTemplate) {
      setValue('templateViewerUrl', editingTemplate.templateMeta?.templateViewerUrl || '');
      setValue('postingUrl', editingTemplate.templateMeta?.postingUrl || '');
      setValue('templatePrompt', editingTemplate.templateMeta?.templatePrompt || '');
      setValue('templateMarkdown', editingTemplate.templateMeta?.templateMarkdown || '');
      setValue('organizingAgency', editingTemplate.templateMeta?.organizingAgency ?? '');
      setValue('deadline', editingTemplate.templateMeta?.deadline || '');
    }
  }, [editingTemplate, setValue]);

  // 검색어 디바운싱
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const isSearching = deferredSearchQuery.trim().length > 0;

  // 검색 중일 때는 전체 데이터를 가져옴
  const { data: productFilesData, isLoading, isFetching } = useQuery({
    queryKey: ['productFiles', isSearching ? 'all' : currentPage, isSearching ? 1000 : pageSize],
    queryFn: () => getProductFiles({
      page: isSearching ? 0 : currentPage,
      size: isSearching ? 1000 : pageSize,
      fileType: 'ALL'
    })
  });

  const templatesData = productFilesData?.data?.templates;
  const formatsData = productFilesData?.data?.formats;
  const exportsData = productFilesData?.data?.exports;

  // 현재 탭에 해당하는 데이터 가져오기
  const getCurrentTabData = () => {
    switch (activeTab) {
      case 'templates':
        return templatesData;
      case 'formats':
        return formatsData;
      case 'exports':
        return exportsData;
      default:
        return templatesData;
    }
  };

  const currentTabData = getCurrentTabData();

  const totalPages = currentTabData?.totalPages ?? 0;

  const paginationButtons = useMemo(() => {
    const buttons: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 0; i < totalPages; i++) {
        buttons.push(i);
      }
    } else {
      buttons.push(0);

      if (currentPage > 2) {
        buttons.push('ellipsis');
      }

      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!buttons.includes(i)) {
          buttons.push(i);
        }
      }

      if (currentPage < totalPages - 3) {
        buttons.push('ellipsis');
      }

      if (!buttons.includes(totalPages - 1)) {
        buttons.push(totalPages - 1);
      }
    }

    return buttons;
  }, [currentPage, totalPages]);

  const filteredItems = useMemo(() => {
    const content = currentTabData?.content;
    if (!content || content.length === 0) return [];
    if (!deferredSearchQuery.trim()) return content;

    // 한글 유니코드 정규화 (NFD → NFC 통일)
    const query = deferredSearchQuery.trim().toLowerCase().normalize('NFC');
    return content.filter((item) => {
      const fileName = parseFileName(item.filePath);
      // 파싱된 파일 이름 또는 원본 경로에서 검색 (정규화 적용)
      const normalizedFileName = (fileName || '').toLowerCase().normalize('NFC');
      const normalizedPath = (item.filePath || '').toLowerCase().normalize('NFC');
      const fileNameMatch = normalizedFileName.includes(query);
      const pathMatch = normalizedPath.includes(query);
      return fileNameMatch || pathMatch;
    });
  }, [currentTabData, deferredSearchQuery]);

  // templates 탭에서만 정렬 적용: displayOrder 기준
  const sortedItems = useMemo(() => {
    if (activeTab !== 'templates') return filteredItems;

    return [...filteredItems].sort((a, b) => {
      const aTemplate = 'templateMeta' in a ? a as TemplateFileContents : null;
      const bTemplate = 'templateMeta' in b ? b as TemplateFileContents : null;

      const aOrder = aTemplate?.displayOrder ?? Number.MAX_SAFE_INTEGER;
      const bOrder = bTemplate?.displayOrder ?? Number.MAX_SAFE_INTEGER;

      return aOrder - bOrder;
    });
  }, [filteredItems, activeTab]);

  const handleCloseEditModal = useCallback(() => {
    setEditingTemplate(null);
    reset();
  }, [reset]);

  // ESC 키로 모달/메뉴 닫기
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (openMenuId !== null) {
          setOpenMenuId(null);
        } else if (editingTemplate) {
          handleCloseEditModal();
        }
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [editingTemplate, openMenuId, handleCloseEditModal]);

  // 메뉴 바깥 클릭 시 닫기
  useEffect(() => {
    if (openMenuId === null) return;
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  // 탭 변경 시 페이지 초기화
  const handleTabChange = (tab: FileTabType) => {
    setActiveTab(tab);
    setCurrentPage(0);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteTemplateFormat,
    onSuccess: () => {
      toast.showToast('템플릿이 성공적으로 삭제되었습니다.', {
        duration: 3000
      });
      queryClient.invalidateQueries({ queryKey: ['productFiles'] });
      handleCloseEditModal();
    },
    onError: (error: Error) => {
      toast.showToast(`템플릿 삭제에 실패했습니다: ${error.message}`, {
        duration: 5000
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ productFileId, data }: { productFileId: number; data: UpdateTemplateMetaFormData }) =>
      updateTemplateMeta(productFileId, {
        templateViewerUrl: data.templateViewerUrl || null,
        postingUrl: data.postingUrl || null,
        templatePrompt: data.templatePrompt || null,
        templateMarkdown: data.templateMarkdown || null,
        organizingAgency: data.organizingAgency || null,
        deadline: data.deadline || null
      }),
    onSuccess: () => {
      toast.showToast('템플릿 메타 정보가 성공적으로 수정되었습니다.', {
        duration: 3000
      });
      queryClient.invalidateQueries({ queryKey: ['productFiles'] });
      handleCloseEditModal();
    },
    onError: (error: Error) => {
      toast.showToast(`템플릿 수정에 실패했습니다: ${error.message}`, {
        duration: 5000
      });
    }
  });

  const reorderMutation = useMutation({
    mutationFn: ({ productFileId, targetPosition }: { productFileId: number; targetPosition: number }) =>
      reorderTemplate(productFileId, { targetPosition }),
    onSuccess: () => {
      toast.showToast('템플릿 순서가 성공적으로 변경되었습니다.', {
        duration: 3000
      });
      queryClient.invalidateQueries({ queryKey: ['productFiles'] });
      setEditingOrderId(null);
      setEditingOrderValue('');
    },
    onError: (error: Error) => {
      toast.showToast(`순서 변경에 실패했습니다: ${error.message}`, {
        duration: 5000
      });
    }
  });

  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  const replaceMutation = useMutation({
    mutationFn: ({ productFileId, file }: { productFileId: number; file: File }) =>
      replaceTemplateFile(productFileId, file),
    onSuccess: () => {
      toast.showToast('파일이 성공적으로 교체되었습니다.', {
        duration: 3000
      });
      queryClient.invalidateQueries({ queryKey: ['productFiles'] });
      replaceTargetIdRef.current = null;
    },
    onError: (error: Error) => {
      toast.showToast(`파일 교체에 실패했습니다: ${error.message}`, {
        duration: 5000
      });
      replaceTargetIdRef.current = null;
    }
  });

  const handleDownload = useCallback(async (productFileId: number, filePath: string | null) => {
    try {
      const blob = await downloadTemplateFile(productFileId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileName = parseFileName(filePath);
      a.download = fileName === '-' ? `template-${productFileId}` : fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.showToast(`파일 다운로드에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`, {
        duration: 5000
      });
    }
  }, [toast]);

  const handleReplaceClick = useCallback((productFileId: number) => {
    replaceTargetIdRef.current = productFileId;
    setOpenMenuId(null);
    replaceFileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetId = replaceTargetIdRef.current;
    if (!file || !targetId) {
      replaceTargetIdRef.current = null;
      return;
    }

    const allowedExtensions = ['.hwp', '.hwpx', '.docx'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      toast.showToast(`허용되지 않는 파일 형식입니다. (${allowedExtensions.join(', ')}만 가능)`, {
        duration: 5000
      });
      e.target.value = '';
      replaceTargetIdRef.current = null;
      return;
    }

    replaceMutation.mutate({ productFileId: targetId, file });
    e.target.value = '';
  }, [replaceMutation, toast]);

  const handleDelete = (templateId: number) => {
    if (window.confirm('정말로 이 템플릿을 삭제하시겠습니까?')) {
      deleteMutation.mutate(templateId);
    }
  };

  const handleEdit = (template: TemplateFileContents) => {
    setEditingTemplate(template);
  };

  const onSubmitEdit = (data: UpdateTemplateMetaFormData) => {
    if (!editingTemplate) return;
    updateMutation.mutate({
      productFileId: editingTemplate.productFileId,
      data
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleOrderEditStart = (template: TemplateFileContents) => {
    setEditingOrderId(template.productFileId);
    setEditingOrderValue(template.displayOrder?.toString() ?? '0');
  };

  const handleOrderEditCancel = () => {
    setEditingOrderId(null);
    setEditingOrderValue('');
  };

  const handleOrderEditSave = (productFileId: number) => {
    const targetPosition = parseInt(editingOrderValue, 10);
    const maxPosition = templatesData?.totalElements ?? 0;
    if (isNaN(targetPosition) || targetPosition < 1 || targetPosition > maxPosition) {
      toast.showToast(`순서는 1~${maxPosition} 범위여야 합니다.`, {
        duration: 3000
      });
      return;
    }
    reorderMutation.mutate({ productFileId, targetPosition });
  };

  const handleOrderKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, productFileId: number) => {
    if (e.key === 'Enter') {
      handleOrderEditSave(productFileId);
    } else if (e.key === 'Escape') {
      handleOrderEditCancel();
    }
  };

  // 템플릿인지 확인하는 타입 가드
  const isTemplateItem = (item: TemplateFileContents | ProductFileContents): item is TemplateFileContents => {
    return activeTab === 'templates' && 'templateMeta' in item;
  };

  // 탭별 라벨 가져오기
  const getTabLabel = (tab: FileTabType) => {
    switch (tab) {
      case 'templates':
        return '템플릿';
      case 'formats':
        return '포맷';
      case 'exports':
        return '익스포트';
    }
  };

  // 빈 상태 메시지
  const getEmptyMessage = () => {
    if (searchQuery) return '검색 결과가 없습니다.';
    return `등록된 ${getTabLabel(activeTab)}이(가) 없습니다.`;
  };

  const shouldGuardCurrentTab = activeTab !== 'templates';

  const fileListSection = (
    <div>
      <TabContainer>
        <Tab
          $active={activeTab === 'templates'}
          onClick={() => handleTabChange('templates')}
        >
          템플릿
          <TabCount>{templatesData?.totalElements ?? 0}</TabCount>
        </Tab>
        <Tab
          $active={activeTab === 'formats'}
          onClick={() => handleTabChange('formats')}
        >
          포맷
          <TabCount>{formatsData?.totalElements ?? 0}</TabCount>
        </Tab>
        <Tab
          $active={activeTab === 'exports'}
          onClick={() => handleTabChange('exports')}
        >
          익스포트
          <TabCount>{exportsData?.totalElements ?? 0}</TabCount>
        </Tab>
      </TabContainer>

      <TableContainer style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>ID</TableHeader>
              <TableHeader style={{ minWidth: '250px' }}>파일 이름</TableHeader>
              {activeTab !== 'templates' && <TableHeader>상태</TableHeader>}
              {activeTab === 'templates' && (
                <>
                  <TableHeader style={{ width: '100px', textAlign: 'center' }}>순서</TableHeader>
                  <TableHeader>뷰어 URL</TableHeader>
                  <TableHeader>공고 URL</TableHeader>
                  <TableHeader>커스텀 프롬프트</TableHeader>
                  <TableHeader style={{ width: '160px' }}>마감일시</TableHeader>
                  <TableHeader style={{ width: '140px' }}>주관 기관</TableHeader>
                </>
              )}
              <TableHeader>생성일시</TableHeader>
              {activeTab === 'templates' && (
                <TableHeader style={{ width: '50px', textAlign: 'center' }} />
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading || (isFetching && isSearching) ? (
              <TableRow>
                <TableCell colSpan={activeTab === 'templates' ? 10 : 4}>
                  <EmptyState>{isSearching ? '검색 중...' : '로딩 중...'}</EmptyState>
                </TableCell>
              </TableRow>
            ) : sortedItems.length > 0 ? (
              sortedItems.map((item) => {
                const fileName = parseFileName(item.filePath);
                const template = isTemplateItem(item) ? item : null;

                return (
                  <TableRow key={item.productFileId}>
                    <TableCell>{item.productFileId}</TableCell>
                    <TableCell>
                      <DownloadableFileName
                        title={item.filePath || ''}
                        onClick={() => handleDownload(item.productFileId, item.filePath)}
                      >
                        {fileName}
                      </DownloadableFileName>
                    </TableCell>
                    {activeTab !== 'templates' && (
                      <TableCell>
                        <StatusBadge $status={item.status}>{item.status}</StatusBadge>
                      </TableCell>
                    )}
                    {activeTab === 'templates' && template && (
                      <>
                        <TableCell style={{ textAlign: 'center' }}>
                          {editingOrderId === template.productFileId ? (
                            <Flex alignItems="center" gap={4} justify="center">
                              <TextInput
                                type="number"
                                value={editingOrderValue}
                                onChange={(e) => setEditingOrderValue(e.target.value)}
                                onKeyDown={(e) => handleOrderKeyDown(e, template.productFileId)}
                                onBlur={() => handleOrderEditSave(template.productFileId)}
                                style={{ width: '70px', textAlign: 'center', padding: '4px 8px' }}
                                min={1}
                                autoFocus
                                disabled={reorderMutation.isPending}
                              />
                            </Flex>
                          ) : (
                            <OrderCell
                              onClick={() => handleOrderEditStart(template)}
                              title="클릭하여 순서 변경"
                            >
                              {template.displayOrder ?? '-'}
                            </OrderCell>
                          )}
                        </TableCell>
                        <TableCell>
                          {template.templateMeta?.templateViewerUrl ? (
                            <LinkCell
                              href={template.templateMeta.templateViewerUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <TruncatedText style={{ maxWidth: '140px' }} title={template.templateMeta.templateViewerUrl}>
                                {template.templateMeta.templateViewerUrl}
                              </TruncatedText>
                            </LinkCell>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          {template.templateMeta?.postingUrl ? (
                            <LinkCell
                              href={template.templateMeta.postingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <TruncatedText style={{ maxWidth: '140px' }} title={template.templateMeta.postingUrl}>
                                {template.templateMeta.postingUrl}
                              </TruncatedText>
                            </LinkCell>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          {template.templateMeta?.templatePrompt ? (
                            <TruncatedText
                              style={{ maxWidth: '150px' }}
                              title={template.templateMeta.templatePrompt}
                            >
                              {template.templateMeta.templatePrompt}
                            </TruncatedText>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          {template.templateMeta?.deadline ? (
                            <DeadlineText
                              $isExpired={new Date(template.templateMeta.deadline) < new Date()}
                            >
                              {formatDate(template.templateMeta.deadline)}
                            </DeadlineText>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          {template.templateMeta?.organizingAgency || null}
                        </TableCell>
                      </>
                    )}
                    <TableCell style={{ whiteSpace: 'nowrap' }}>{formatDate(item.createdAt)}</TableCell>
                    {activeTab === 'templates' && template && (
                      <TableCell style={{ textAlign: 'center' }}>
                        <ActionCellWrapper>
                          <ActionButton
                            type="button"
                            aria-label="액션 메뉴"
                            aria-haspopup="menu"
                            aria-expanded={openMenuId === template.productFileId}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === template.productFileId ? null : template.productFileId);
                            }}
                          >
                            {'\u2026'}
                          </ActionButton>
                          {openMenuId === template.productFileId && (
                            <ActionMenu onClick={(e) => e.stopPropagation()}>
                              <ActionMenuItem onClick={() => {
                                handleEdit(template);
                                setOpenMenuId(null);
                              }}>
                                수정
                              </ActionMenuItem>
                              <ActionMenuItem
                                onClick={() => handleReplaceClick(template.productFileId)}
                                disabled={replaceMutation.isPending}
                              >
                                파일 교체
                              </ActionMenuItem>
                              <ActionMenuItem onClick={() => {
                                handleDownload(template.productFileId, template.filePath);
                                setOpenMenuId(null);
                              }}>
                                다운로드
                              </ActionMenuItem>
                            </ActionMenu>
                          )}
                        </ActionCellWrapper>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={activeTab === 'templates' ? 10 : 4}>
                  <EmptyState>{getEmptyMessage()}</EmptyState>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {!isSearching && totalPages > 1 && (
          <PaginationContainer>
            <PageButton
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              이전
            </PageButton>

            {paginationButtons.map((page, index) =>
              page === 'ellipsis' ? (
                <PageEllipsis key={`ellipsis-${index}`}>...</PageEllipsis>
              ) : (
                <PageButton
                  key={page}
                  $active={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page + 1}
                </PageButton>
              )
            )}

            <PageButton
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
              }
              disabled={currentPage === totalPages - 1}
            >
              다음
            </PageButton>
          </PaginationContainer>
        )}
      </TableContainer>
    </div>
  );

  return (
    <Flex direction="column" gap={24}>
      <PageHeader>
        <PageTitle>파일 조회</PageTitle>
        <PageDescription>
          등록된 템플릿, 포맷, 익스포트 파일 목록을 조회하고 관리할 수 있습니다.
        </PageDescription>
      </PageHeader>

      <SearchContainer>
        <SearchWrapper>
          <TextInput
            type="text"
            placeholder="파일 이름으로 검색..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </SearchWrapper>
      </SearchContainer>

      {shouldGuardCurrentTab ? (
        <PasswordGuard
          description="포맷/익스포트 파일 조회에 접근하려면 관리자 패스워드가 필요합니다."
          onCancel={() => handleTabChange('templates')}
        >
          {fileListSection}
        </PasswordGuard>
      ) : (
        fileListSection
      )}

      {editingTemplate && (
        <ModalOverlay onClick={handleCloseEditModal}>
          <ModalContent
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-template-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle id="edit-template-modal-title">템플릿 메타 정보 수정</ModalTitle>
              <ModalCloseButton onClick={handleCloseEditModal}>
                ✕
              </ModalCloseButton>
            </ModalHeader>
            <ModalForm onSubmit={handleSubmit(onSubmitEdit)}>
              <ModalBody>
                <FormSection>
                  <Label htmlFor="templateViewerUrl">뷰어 URL</Label>
                  <TextInput
                    id="templateViewerUrl"
                    type="url"
                    placeholder="https://example.com/viewer"
                    {...register('templateViewerUrl')}
                  />
                  {errors.templateViewerUrl && (
                    <ErrorMessage>{errors.templateViewerUrl.message}</ErrorMessage>
                  )}
                  <HelpText>원본 파일을 볼 수 있는 뷰어 링크 (최대 2,000자)</HelpText>
                </FormSection>

                <FormSection>
                  <Label htmlFor="postingUrl">공고 URL</Label>
                  <TextInput
                    id="postingUrl"
                    type="url"
                    placeholder="https://example.com/posting"
                    {...register('postingUrl')}
                  />
                  {errors.postingUrl && (
                    <ErrorMessage>{errors.postingUrl.message}</ErrorMessage>
                  )}
                  <HelpText>관련 공고 링크 (최대 2,000자)</HelpText>
                </FormSection>

                <FormSection>
                  <Label htmlFor="templatePrompt">커스텀 프롬프트</Label>
                  <TextArea
                    id="templatePrompt"
                    placeholder="이 템플릿에 대한 커스텀 프롬프트를 입력하세요..."
                    rows={4}
                    {...register('templatePrompt')}
                  />
                  {errors.templatePrompt && (
                    <ErrorMessage>{errors.templatePrompt.message}</ErrorMessage>
                  )}
                  <HelpText>템플릿에 대한 맞춤 프롬프트 (최대 10,000자)</HelpText>
                </FormSection>

                <FormSection>
                  <Label htmlFor="templateMarkdown">템플릿 마크다운</Label>
                  <TextArea
                    id="templateMarkdown"
                    placeholder="템플릿 마크다운 내용을 입력하세요..."
                    rows={6}
                    {...register('templateMarkdown')}
                  />
                  {errors.templateMarkdown && (
                    <ErrorMessage>{errors.templateMarkdown.message}</ErrorMessage>
                  )}
                  <HelpText>템플릿 마크다운 콘텐츠 (최대 100,000자)</HelpText>
                </FormSection>

                <FormSection>
                  <Label htmlFor="edit-deadline">마감일시</Label>
                  <TextInput
                    id="edit-deadline"
                    type="datetime-local"
                    {...register('deadline')}
                  />
                  <HelpText>공고 마감일시 (비워두면 마감일 없음)</HelpText>
                </FormSection>

                <FormSection>
                  <Label htmlFor="edit-organizingAgency">주관 기관</Label>
                  <TextInput
                    id="edit-organizingAgency"
                    type="text"
                    placeholder="예: 창업진흥원"
                    {...register('organizingAgency')}
                  />
                  {errors.organizingAgency && (
                    <ErrorMessage>{errors.organizingAgency.message}</ErrorMessage>
                  )}
                  <HelpText>공고를 주관하는 기관명을 입력하세요 (최대 200자)</HelpText>
                </FormSection>

              </ModalBody>
              <ModalFooter style={{ justifyContent: 'space-between' }}>
                <DeleteButton
                  type="button"
                  onClick={() => handleDelete(editingTemplate.productFileId)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? '삭제 중...' : '삭제'}
                </DeleteButton>
                <Flex gap={8}>
                  <CancelButton type="button" onClick={handleCloseEditModal}>
                    취소
                  </CancelButton>
                  <SubmitButton type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? '수정 중...' : '수정'}
                  </SubmitButton>
                </Flex>
              </ModalFooter>
            </ModalForm>
          </ModalContent>
        </ModalOverlay>
      )}

      <HiddenFileInput
        type="file"
        accept=".hwp,.hwpx,.docx"
        ref={replaceFileInputRef}
        onChange={handleFileChange}
      />
    </Flex>
  );
}
