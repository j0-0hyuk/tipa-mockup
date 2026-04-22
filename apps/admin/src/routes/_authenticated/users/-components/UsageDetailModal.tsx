import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Flex, Skeleton } from '@bichon/ds';
import {
  ConfirmOverlay,
  ConfirmContent,
  ConfirmHeader,
  ConfirmTitle,
  ConfirmBody,
  ConfirmFooter,
  CancelButton,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  EmptyState,
  PaginationContainer,
  PaginationButton,
  PaginationInfo,
  Select,
  StatusBadge
} from '@/routes/_authenticated/users/users.style';
import {
  getAccountFiles,
  getAccountProducts
} from '@/api/authenticated/accounts';
import type { AccountFile, AccountProduct } from '@/schema/api/accounts/usage-detail';

type ModalType = 'files' | 'products';

interface UsageDetailModalProps {
  type: ModalType;
  accountId: number;
  onClose: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: '대기',
  PROGRESS: '진행 중',
  COMPLETED: '완료',
  FAILED: '실패'
};

const FILE_TYPE_LABELS: Record<string, string> = {
  FORMAT: '양식',
  EXPORT: '내보내기',
  TEMPLATE: '템플릿',
  IMAGE: '이미지'
};

const STATUS_BADGE_MAP: Record<string, string> = {
  PENDING: 'SCHEDULED',
  PROGRESS: 'SCHEDULED',
  COMPLETED: 'ACTIVE',
  FAILED: 'EXPIRED'
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

function extractFileName(filePath: string | null) {
  if (!filePath) return '-';
  const parts = filePath.split('/');
  return parts[parts.length - 1] || filePath;
}

export function UsageDetailModal({ type, accountId, onClose }: UsageDetailModalProps) {
  const [fileType, setFileType] = useState('ALL');

  const title = type === 'files' ? '양식 채우기 내역' : '사업계획서 초안 내역';

  return (
    <ConfirmOverlay onClick={onClose}>
      <ConfirmContent
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 720, maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
      >
        <ConfirmHeader>
          <Flex justify="space-between" alignItems="center">
            <ConfirmTitle>{title}</ConfirmTitle>
            {type === 'files' && (
              <Select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                style={{ padding: '6px 10px', fontSize: 13 }}
              >
                <option value="ALL">전체</option>
                <option value="FORMAT">양식</option>
                <option value="EXPORT">내보내기</option>
                <option value="TEMPLATE">템플릿</option>
                <option value="IMAGE">이미지</option>
              </Select>
            )}
          </Flex>
        </ConfirmHeader>

        <ConfirmBody style={{ flex: 1, overflow: 'auto', padding: '0 24px 16px' }}>
          {type === 'files' ? (
            <FileTable key={fileType} accountId={accountId} fileType={fileType} />
          ) : (
            <ProductTable accountId={accountId} />
          )}
        </ConfirmBody>

        <ConfirmFooter>
          <CancelButton onClick={onClose}>닫기</CancelButton>
        </ConfirmFooter>
      </ConfirmContent>
    </ConfirmOverlay>
  );
}

// ─── 파일 테이블 ────────────────────────────────────────

function FileTable({
  accountId,
  fileType
}: {
  accountId: number;
  fileType: string;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const size = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['account-files', accountId, currentPage, size, fileType],
    queryFn: () => getAccountFiles(accountId, { page: currentPage, size, fileType }),
    throwOnError: false,
    retry: false
  });

  if (isLoading) {
    return (
      <Flex direction="column" gap={8} style={{ padding: '16px 0' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} loading width="100%" height={40} />
        ))}
      </Flex>
    );
  }

  if (isError) {
    return <EmptyState>데이터를 불러오는 중 오류가 발생했습니다.</EmptyState>;
  }

  if (!data || data.content.length === 0) {
    return <EmptyState>데이터가 없습니다.</EmptyState>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <tr>
            <TableHeaderCell>파일명</TableHeaderCell>
            <TableHeaderCell>타입</TableHeaderCell>
            <TableHeaderCell>상태</TableHeaderCell>
            <TableHeaderCell>생성일</TableHeaderCell>
          </tr>
        </TableHeader>
        <TableBody>
          {data.content.map((file: AccountFile) => (
            <TableRow key={file.productFileId}>
              <TableCell title={file.filePath ?? undefined}>
                {extractFileName(file.filePath)}
              </TableCell>
              <TableCell>
                {file.fileType ? FILE_TYPE_LABELS[file.fileType] ?? file.fileType : '-'}
              </TableCell>
              <TableCell>
                <StatusBadge $status={STATUS_BADGE_MAP[file.status] ?? file.status}>
                  {STATUS_LABELS[file.status] ?? file.status}
                </StatusBadge>
              </TableCell>
              <TableCell>{formatDate(file.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {data.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={data.totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
}

// ─── 초안 테이블 ────────────────────────────────────────

function ProductTable({
  accountId
}: {
  accountId: number;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const size = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['account-products', accountId, currentPage, size],
    queryFn: () => getAccountProducts(accountId, { page: currentPage, size }),
    throwOnError: false,
    retry: false
  });

  if (isLoading) {
    return (
      <Flex direction="column" gap={8} style={{ padding: '16px 0' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} loading width="100%" height={40} />
        ))}
      </Flex>
    );
  }

  if (isError) {
    return <EmptyState>데이터를 불러오는 중 오류가 발생했습니다.</EmptyState>;
  }

  if (!data || data.content.length === 0) {
    return <EmptyState>데이터가 없습니다.</EmptyState>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <tr>
            <TableHeaderCell>제목</TableHeaderCell>
            <TableHeaderCell>상태</TableHeaderCell>
            <TableHeaderCell>생성일</TableHeaderCell>
          </tr>
        </TableHeader>
        <TableBody>
          {data.content.map((product: AccountProduct) => (
            <TableRow key={product.id}>
              <TableCell title={product.itemName ?? undefined}>
                {product.itemName ?? '-'}
              </TableCell>
              <TableCell>
                {product.generationStatus ? (
                  <StatusBadge
                    $status={STATUS_BADGE_MAP[product.generationStatus] ?? product.generationStatus}
                  >
                    {STATUS_LABELS[product.generationStatus] ?? product.generationStatus}
                  </StatusBadge>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>{formatDate(product.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {data.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={data.totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
}

// ─── 페이지네이션 ───────────────────────────────────────

function Pagination({
  currentPage,
  totalPages,
  onPageChange
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const maxVisible = 5;
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(0, currentPage - half);
  const end = Math.min(totalPages, start + maxVisible);

  if (end - start < maxVisible) {
    start = Math.max(0, end - maxVisible);
  }

  const pages = Array.from({ length: end - start }, (_, i) => start + i);

  return (
    <PaginationContainer>
      <PaginationButton
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &lt;
      </PaginationButton>
      {pages.map((p) => (
        <PaginationButton
          key={p}
          $active={p === currentPage}
          onClick={() => onPageChange(p)}
        >
          {p + 1}
        </PaginationButton>
      ))}
      <PaginationButton
        disabled={currentPage >= totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
      >
        &gt;
      </PaginationButton>
      <PaginationInfo>
        {currentPage + 1} / {totalPages}
      </PaginationInfo>
    </PaginationContainer>
  );
}
