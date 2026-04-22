import { useCallback, useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { Flex, Tooltip, IconButton } from '@docs-front/ui';
import { Download, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import {
  TableWrap,
  HeaderRow,
  BodyRow,
  HeadCell,
  BodyCell,
  EmptyStateRow,
  EmptyStateCell,
  EmptyStateText,
  EmptyStateButton,
  FileIcon
} from '@/routes/_authenticated/d/-components/ExportSection/DocsList/DocsList.style';
import { useI18n } from '@/hooks/useI18n';
import type { ProductFilePathMapContents } from '@/schema/api/products/products';
import { useModal } from '@/hooks/useModal';
import { DocsDeleteModal } from '@/routes/_authenticated/d/-components/ExportSection/DocsList/components/DocsDeleteModal';
import { getFileNameFromPath } from '@/utils/file/getFileNameFromPath';

interface DocsListProps {
  docs: ProductFilePathMapContents[];
  emptyStateText?: string;
  emptyStateButtonText?: string;
  onEmptyStateButtonClick?: () => void;
  onDownload?: (doc: ProductFilePathMapContents) => void | Promise<void>;
}

const columnHelper = createColumnHelper<ProductFilePathMapContents>();
const EDITABLE_AFTER = new Date('2026-03-23T00:00:00');

export function DocsList({
  docs,
  emptyStateText,
  emptyStateButtonText,
  onEmptyStateButtonClick,
  onDownload
}: DocsListProps) {
  const { t } = useI18n(['main']);
  const { openModal } = useModal();
  const navigate = useNavigate();

  const handleDownload = useCallback(
    (doc: ProductFilePathMapContents) => {
      onDownload?.(doc);
    },
    [onDownload]
  );

  const handleDelete = useCallback(
    (doc: ProductFilePathMapContents) => {
      if (doc.status === 'PROGRESS' || doc.status === 'PENDING') {
        return;
      }

      const productFileId = Number(doc.productFileId);
      openModal(({ onClose }) => (
        <DocsDeleteModal productFileId={productFileId} onClose={onClose} />
      ));
    },
    [openModal]
  );

  const isEditable = useCallback(
    (doc: ProductFilePathMapContents) => {
      if (doc.status !== 'COMPLETED') return false;
      const created = new Date(doc.createdAtRaw);
      return created >= EDITABLE_AFTER;
    },
    []
  );

  const handleEdit = useCallback(
    (doc: ProductFilePathMapContents) => {
      if (!isEditable(doc)) return;

      navigate({
        to: '/d/$productFileId',
        params: { productFileId: String(doc.productFileId) }
      });
    },
    [navigate, isEditable]
  );

  const columns = useMemo(() => {
    return [
      columnHelper.accessor('filePath', {
        header: t('main:docs.table.columns.filename'),
        cell: (info) => {
          const filePath = info.getValue();
          if (!filePath) return '-';
          const fileName = getFileNameFromPath(filePath) || filePath;

          return (
            <Flex direction="row" gap={8} alignItems="center">
              <FileIcon src="/images/icons/hwpx-icon.webp" alt="" />
              <span>{fileName}</span>
            </Flex>
          );
        }
      }),
      columnHelper.accessor('createdAt', {
        header: t('main:docs.table.columns.createdAt'),
        cell: (info) => info.getValue()
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: (info) => {
          const doc = info.row.original;
          const isProcessing =
            doc.status === 'PROGRESS' || doc.status === 'PENDING';

          const editable = isEditable(doc);

          return (
            <Flex direction="row" gap={12} justify="center" alignItems="center">
              <Tooltip
                content={
                  isProcessing
                    ? '문서 생성중(약 10분 소요)'
                    : !editable
                      ? '2026년 3월 23일 이후 문서만 수정 가능합니다'
                      : '수정하기'
                }
              >
                <IconButton
                  type="button"
                  variant="outlined"
                  size="medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(doc);
                  }}
                  disabled={!editable}
                >
                  <Pencil size={16} style={{ strokeWidth: 1.4 }} />
                </IconButton>
              </Tooltip>
              <Tooltip
                content={
                  isProcessing ? '문서 생성중(약 10분 소요)' : '다운로드'
                }
              >
                <IconButton
                  type="button"
                  variant="outlined"
                  size="medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(doc);
                  }}
                  disabled={isProcessing}
                >
                  <Download size={16} style={{ strokeWidth: 1.4 }} />
                </IconButton>
              </Tooltip>
              <Tooltip
                side="right"
                content={
                  isProcessing ? '문서 생성중(약 10분 소요)' : '삭제하기'
                }
              >
                <IconButton
                  type="button"
                  variant="outlined"
                  size="medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(doc);
                  }}
                  disabled={isProcessing}
                >
                  <Trash2 size={16} style={{ strokeWidth: 1.4 }} />
                </IconButton>
              </Tooltip>
            </Flex>
          );
        }
      })
    ];
  }, [handleDownload, handleDelete, handleEdit, isEditable, t]);

  const table = useReactTable({
    data: docs,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  const isEmpty = docs.length === 0;

  return (
    <TableWrap>
      <HeaderRow>
        {table
          .getHeaderGroups()
          .map((headerGroup) =>
            headerGroup.headers.map((header) => (
              <HeadCell key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </HeadCell>
            ))
          )}
      </HeaderRow>
      {isEmpty ? (
        <EmptyStateRow>
          <EmptyStateCell>
            <Flex direction="column" gap={10} alignItems="center">
              {emptyStateText && (
                <EmptyStateText>{emptyStateText}</EmptyStateText>
              )}
              {emptyStateButtonText && onEmptyStateButtonClick && (
                <Flex>
                  <EmptyStateButton
                    type="button"
                    variant="outlined"
                    size="medium"
                    onClick={onEmptyStateButtonClick}
                  >
                    {emptyStateButtonText}
                  </EmptyStateButton>
                </Flex>
              )}
            </Flex>
          </EmptyStateCell>
        </EmptyStateRow>
      ) : (
        table.getRowModel().rows.map((row) => {
          return (
            <BodyRow key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <BodyCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </BodyCell>
                );
              })}
            </BodyRow>
          );
        })
      )}
    </TableWrap>
  );
}
