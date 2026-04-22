import { useCallback, useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable
} from '@tanstack/react-table';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Pagination, Tooltip } from '@docs-front/ui';
import {
  Badge,
  TableBody,
  TableBodyRow,
  TableHeader,
  TableHeaderRow
} from '@bichon/ds';
import { FileText, SquarePen, Star } from 'lucide-react';

import {
  deleteTemplateInterest,
  postTemplateInterest
} from '@/api/template';
import { getProduct } from '@/api/products/query';
import { getProductsFilesOptions } from '@/query/options/products';
import type { ProductFilePathMapContents } from '@/schema/api/products/products';
import { getFileNameFromPath } from '@/utils/file/getFileNameFromPath';

import {
  TableViewport,
  TableFrame,
  StyledTable,
  StyledHeaderCell,
  StyledBodyCell,
  EmptyStateCell,
  EmptyStateText,
  DocumentNameText,
  DateText,
  TableFooter,
  InterestIconButton,
  FileIcon,
  DraftIconWrapper,
  DraftBadge,
  SelectedTableBodyRow
} from '@/routes/_authenticated/f/upload/-components/ExistingDocumentsTable/ExistingDocumentsTable.style';

// --- 통합 Row 타입 ---

export interface UnifiedDocumentRow {
  sourceType: 'export' | 'draft';
  id: number;
  exportDocument?: ProductFilePathMapContents;
  isInterested: boolean;
  /** 통합 문서명 (export: 파일명, draft: 아이템명) */
  documentName: string;
  createdAt: string;
  createdAtTimestamp: number;
}

export type SelectedDocumentInfo =
  | { type: 'export'; document: ProductFilePathMapContents }
  | { type: 'draft'; product: { id: number; itemName: string | null; content: string } };

interface ExistingDocumentsTableProps {
  exportDocuments: ProductFilePathMapContents[];
  draftProducts: { id: number; itemName: string | null }[];
  /** 현재 선택된 문서 (행 하이라이트 + 버튼 텍스트 변경) */
  selectedDocument: SelectedDocumentInfo | null;
  onUpload: (info: SelectedDocumentInfo | null) => void;
}

interface ColumnMeta {
  width?: string;
  align?: 'left' | 'center' | 'right';
  headerAlign?: 'left' | 'center' | 'right';
}

const PAGE_SIZE = 10;

const parseDocumentName = (filePath: string | null): string => {
  const fullFileName = getFileNameFromPath(filePath);
  if (!fullFileName) return '-';
  return fullFileName.replace(/\.[^/.]+$/, '') || fullFileName;
};

const formatCreatedAt = (raw: string): string => {
  const date = new Date(raw);
  if (isNaN(date.getTime())) return raw;
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yy}.${mm}.${dd} ${hh}:${min}`;
};

const getColumnMeta = (meta: unknown): ColumnMeta =>
  typeof meta === 'object' && meta !== null ? (meta as ColumnMeta) : {};

const columnHelper = createColumnHelper<UnifiedDocumentRow>();

export default function ExistingDocumentsTable({
  exportDocuments,
  draftProducts,
  selectedDocument,
  onUpload
}: ExistingDocumentsTableProps) {
  const queryClient = useQueryClient();
  const exportQueryOptions = getProductsFilesOptions({ page: 0, size: 100, fileType: 'EXPORT' });
  const exportQueryKey = exportQueryOptions.queryKey;
  const [pageIndex, setPageIndex] = useState(0);

  // --- 초안 관심 상태 (로컬) ---
  const [draftInterestMap, setDraftInterestMap] = useState<Record<number, boolean>>({});

  // --- 관심 토글 ---
  const toggleInterestMutation = useMutation({
    mutationFn: ({
      templateFileId,
      isInterested
    }: {
      templateFileId: number;
      isInterested: boolean;
    }) =>
      isInterested
        ? deleteTemplateInterest(templateFileId)
        : postTemplateInterest(templateFileId),
    onSuccess: (_response, { templateFileId, isInterested }) => {
      // 초안인 경우 로컬 상태 업데이트
      const isDraft = draftProducts.some((p) => p.id === templateFileId);
      if (isDraft) {
        setDraftInterestMap((prev) => ({
          ...prev,
          [templateFileId]: !isInterested
        }));
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: exportQueryKey });
    }
  });

  // --- 통합 데이터 ---
  const tableData = useMemo<UnifiedDocumentRow[]>(() => {
    const exportRows: UnifiedDocumentRow[] = exportDocuments.map((doc) => ({
      sourceType: 'export',
      id: doc.productFileId,
      exportDocument: doc,
      isInterested: Boolean(doc.isInterested),
      documentName: parseDocumentName(doc.filePath),
      createdAt: formatCreatedAt(doc.createdAtRaw || doc.createdAt),
      createdAtTimestamp: new Date(doc.createdAtRaw || doc.createdAt).getTime() || 0
    }));

    const draftRows: UnifiedDocumentRow[] = draftProducts.map((product) => ({
      sourceType: 'draft',
      id: product.id,
      isInterested: draftInterestMap[product.id] ?? false,
      documentName: product.itemName || '사업계획서 초안',
      createdAt: '-',
      createdAtTimestamp: 0
    }));

    return [...exportRows, ...draftRows];
  }, [exportDocuments, draftProducts, draftInterestMap]);

  const sorting = useMemo<SortingState>(
    () => [
      { id: 'isInterested', desc: true },
      { id: 'createdAtTimestamp', desc: true }
    ],
    []
  );

  const getSelectedKey = (doc: SelectedDocumentInfo | null): string | null => {
    if (!doc) return null;
    if (doc.type === 'export') return `export-${doc.document.productFileId}`;
    return `draft-${doc.product.id}`;
  };

  const selectedKey = getSelectedKey(selectedDocument);

  const [isFetchingDraft, setIsFetchingDraft] = useState(false);

  const handleUploadClick = useCallback(
    async (row: UnifiedDocumentRow) => {
      const rowKey = `${row.sourceType}-${row.id}`;

      // 이미 선택된 항목이면 선택 해제
      if (selectedKey === rowKey) {
        onUpload(null);
        return;
      }

      if (row.sourceType === 'export' && row.exportDocument) {
        onUpload({ type: 'export', document: row.exportDocument });
      } else {
        // 초안 선택 시 getProduct로 content 가져오기
        setIsFetchingDraft(true);
        try {
          const product = await getProduct(row.id);
          onUpload({
            type: 'draft',
            product: {
              id: row.id,
              itemName: row.documentName,
              content: product.content || ''
            }
          });
        } catch (error) {
          console.error('초안 텍스트 조회 실패:', error);
          onUpload({
            type: 'draft',
            product: { id: row.id, itemName: row.documentName, content: '' }
          });
        } finally {
          setIsFetchingDraft(false);
        }
      }
    },
    [onUpload, selectedKey]
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('isInterested', {
        id: 'isInterested',
        header: '관심',
        meta: { width: '5%', align: 'center' as const },
        cell: (info) => {
          const row = info.row.original;
          const { isInterested } = row;
          return (
            <Tooltip
              side="top"
              content={isInterested ? '관심 해제' : '관심 등록'}
            >
              <InterestIconButton
                type="button"
                variant="text"
                size="large"
                aria-label={`${isInterested ? '관심 해제' : '관심 등록'}: ${row.documentName}`}
                disabled={toggleInterestMutation.isPending}
                $active={isInterested}
                onClick={(event: React.MouseEvent) => {
                  event.stopPropagation();
                  toggleInterestMutation.mutate({
                    templateFileId: row.id,
                    isInterested
                  });
                }}
              >
                <Star
                  size={16}
                  style={{
                    strokeWidth: 1.8,
                    fill: isInterested ? 'currentColor' : 'transparent'
                  }}
                />
              </InterestIconButton>
            </Tooltip>
          );
        }
      }),
      columnHelper.accessor('sourceType', {
        id: 'sourceType',
        header: '분류',
        enableSorting: false,
        meta: { width: '7%', align: 'center' as const },
        cell: (info) =>
          info.getValue() === 'export' ? (
            <Badge size="small" variant="active">
              양식
            </Badge>
          ) : (
            <DraftBadge>초안</DraftBadge>
          )
      }),
      columnHelper.accessor('documentName', {
        header: '문서명',
        meta: {
          width: '40%',
          align: 'left' as const,
          headerAlign: 'center' as const
        },
        cell: (info) => {
          const row = info.row.original;
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {row.sourceType === 'export' ? (
                <FileIcon src="/images/icons/hwpx-icon.webp" alt="" />
              ) : (
                <DraftIconWrapper>
                  <FileText size={14} />
                </DraftIconWrapper>
              )}
              <DocumentNameText>{info.getValue()}</DocumentNameText>
            </div>
          );
        }
      }),
      columnHelper.accessor('createdAtTimestamp', {
        id: 'createdAtTimestamp',
        header: '생성 일시',
        meta: { width: '17%', align: 'center' as const },
        cell: (info) => (
          <DateText>{info.row.original.createdAt}</DateText>
        )
      }),
      columnHelper.display({
        id: 'action',
        header: '',
        meta: { width: '6%', align: 'center' as const },
        cell: (info) => {
          const row = info.row.original;

          return (
            <Tooltip side="top" content="선택">
              <InterestIconButton
                type="button"
                variant="text"
                size="large"
                aria-label={`문서 선택: ${row.documentName}`}
                disabled={isFetchingDraft}
                $active={false}
                onClick={(event: React.MouseEvent) => {
                  event.stopPropagation();
                  handleUploadClick(row);
                }}
              >
                <SquarePen size={24} style={{ strokeWidth: 1.8 }} />
              </InterestIconButton>
            </Tooltip>
          );
        }
      })
    ],
    [handleUploadClick, toggleInterestMutation, isFetchingDraft]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      pagination: { pageIndex, pageSize: PAGE_SIZE }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    enableSortingRemoval: false
  });

  const totalPages = table.getPageCount();
  const isEmpty = tableData.length === 0;
  const visibleColumnCount = table.getVisibleLeafColumns().length;

  return (
    <>
      <TableViewport>
        <TableFrame>
          <StyledTable>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableHeaderRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const meta = getColumnMeta(header.column.columnDef.meta);
                    return (
                      <StyledHeaderCell
                        key={header.id}
                        $align={meta.headerAlign ?? meta.align}
                        style={{ width: meta.width }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </StyledHeaderCell>
                    );
                  })}
                </TableHeaderRow>
              ))}
            </TableHeader>
            <TableBody>
              {isEmpty ? (
                <TableBodyRow>
                  <EmptyStateCell colSpan={visibleColumnCount}>
                    <EmptyStateText>
                      기존 작성 문서가 없습니다
                    </EmptyStateText>
                  </EmptyStateCell>
                </TableBodyRow>
              ) : (
                table.getRowModel().rows.map((row) => {
                  const rowData = row.original;
                  const rowKey = `${rowData.sourceType}-${rowData.id}`;
                  const isSelected = selectedKey === rowKey;

                  return (
                    <SelectedTableBodyRow
                      key={row.id}
                      $selected={isSelected}
                      role="button"
                      tabIndex={isFetchingDraft ? -1 : 0}
                      onClick={() => {
                        if (isFetchingDraft) return;
                        handleUploadClick(rowData);
                      }}
                      onKeyDown={(event: React.KeyboardEvent) => {
                        if (isFetchingDraft) return;
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          handleUploadClick(rowData);
                        }
                      }}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const meta = getColumnMeta(cell.column.columnDef.meta);
                        return (
                          <StyledBodyCell key={cell.id} $align={meta.align}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </StyledBodyCell>
                        );
                      })}
                    </SelectedTableBodyRow>
                  );
                })
              )}
            </TableBody>
          </StyledTable>
        </TableFrame>
      </TableViewport>
      {totalPages > 1 && (
        <TableFooter>
          <Pagination
            currentPage={pageIndex + 1}
            totalPage={totalPages}
            onPageChange={(page) => setPageIndex(page - 1)}
          />
        </TableFooter>
      )}
    </>
  );
}
