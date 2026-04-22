import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Flex, Skeleton } from '@bichon/ds';
import {
  SectionCard,
  SectionHeader,
  SectionTitle,
  SectionDivider,
  StatGrid,
  StatCard,
  StatLabel,
  StatValue,
  StatSub,
  GenerationTable,
  GenerationTableRow,
  EmptyState,
  ProgressBar,
  ProgressFill
} from '@/routes/_authenticated/users/users.style';
import { getAccountSubscriptionUsage } from '@/api/authenticated/accounts';
import { UsageDetailModal } from '@/routes/_authenticated/users/-components/UsageDetailModal';
import type { z } from 'zod';
import type { generationResultSchema } from '@/schema/api/accounts/subscription';

interface UsageTabProps {
  accountId: number;
}

type GenerationResult = z.infer<typeof generationResultSchema>;
type DetailModalType = 'files' | 'products' | null;

function getSuccessRate(result: GenerationResult | undefined): number {
  if (!result || result.total === 0) return 0;
  return ((result.completed / result.total) * 100);
}

export function UsageTab({ accountId }: UsageTabProps) {
  const [detailModal, setDetailModal] = useState<DetailModalType>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['account-subscription', accountId],
    queryFn: () => getAccountSubscriptionUsage(accountId)
  });

  if (isLoading) {
    return (
      <SectionCard>
        <SectionHeader>
          <SectionTitle>사용량</SectionTitle>
        </SectionHeader>
        <Flex direction="column" gap={12}>
          <Flex gap={12}>
            <Skeleton loading width="100%" height={80} />
            <Skeleton loading width="100%" height={80} />
            <Skeleton loading width="100%" height={80} />
          </Flex>
          <Skeleton loading width="100%" height={120} />
        </Flex>
      </SectionCard>
    );
  }

  if (!data) {
    return (
      <SectionCard>
        <EmptyState>사용량 정보를 불러올 수 없습니다.</EmptyState>
      </SectionCard>
    );
  }

  const { usage } = data;

  const fileTotal = usage.fileGenerationResult?.total ?? 0;
  const fileFailed =
    usage.fileGenerationResult?.failed ??
    usage.failedFileGenerationCount ??
    0;
  const fileSuccess =
    usage.fileGenerationResult?.completed ??
    Math.max(fileTotal - fileFailed, 0);
  const fileSuccessRate = getSuccessRate(usage.fileGenerationResult);

  const exportFailed = usage.failedExportFileGenerationCount;

  const productTotal = usage.productGenerationResult?.total ?? 0;
  const productFailed =
    usage.productGenerationResult?.failed ??
    usage.failedProductGenerationCount ??
    0;
  const productSuccess =
    usage.productGenerationResult?.completed ??
    Math.max(productTotal - productFailed, 0);
  const productSuccessRate = getSuccessRate(usage.productGenerationResult);

  const generationRows: {
    label: string;
    data: GenerationResult | undefined;
    variant: 'default' | 'success' | 'error' | 'purple';
  }[] = [
    { label: '양식 채우기', data: usage.fileGenerationResult, variant: 'default' },
    { label: '사업계획서 초안', data: usage.productGenerationResult, variant: 'purple' },
    { label: '전체', data: usage.overallGenerationResult, variant: 'success' }
  ];

  return (
    <SectionCard>
      <SectionHeader>
        <SectionTitle>사용량</SectionTitle>
      </SectionHeader>

      <StatGrid>
        <StatCard $variant="default">
          <Flex justify="space-between" alignItems="center">
            <StatLabel>양식 채우기</StatLabel>
            <DetailButton onClick={() => setDetailModal('files')}>
              상세 보기
            </DetailButton>
          </Flex>
          <StatValue>{fileTotal.toLocaleString()}</StatValue>
          <StatSub>
            성공 {fileSuccess.toLocaleString()} / 실패 {fileFailed.toLocaleString()}
          </StatSub>
          <ProgressBar>
            <ProgressFill $percent={fileSuccessRate} $variant="success" />
          </ProgressBar>
          <StatSub>성공률 {fileSuccessRate.toFixed(1)}%</StatSub>
        </StatCard>
        <StatCard $variant="error">
          <StatLabel>양식채우기 실패</StatLabel>
          <StatValue>{exportFailed.toLocaleString()}</StatValue>
        </StatCard>
        <StatCard $variant="purple">
          <Flex justify="space-between" alignItems="center">
            <StatLabel>사업계획서 초안</StatLabel>
            <DetailButton onClick={() => setDetailModal('products')}>
              상세 보기
            </DetailButton>
          </Flex>
          <StatValue>{productTotal.toLocaleString()}</StatValue>
          <StatSub>
            성공 {productSuccess.toLocaleString()} / 실패 {productFailed.toLocaleString()}
          </StatSub>
          <ProgressBar>
            <ProgressFill $percent={productSuccessRate} $variant="purple" />
          </ProgressBar>
          <StatSub>성공률 {productSuccessRate.toFixed(1)}%</StatSub>
        </StatCard>
      </StatGrid>

      {/* 통합 생성 현황 테이블 */}
      <SectionDivider />
      <SectionTitle style={{ fontSize: '14px' }}>생성 현황</SectionTitle>
      <GenerationTable style={{ marginTop: 8 }}>
        <thead>
          <GenerationTableRow>
            <th>구분</th>
            <th>대기</th>
            <th>진행 중</th>
            <th>완료</th>
            <th>실패</th>
            <th>전체</th>
          </GenerationTableRow>
        </thead>
        <tbody>
          {generationRows.map((row) =>
            row.data ? (
              <GenerationTableRow key={row.label}>
                <td style={{ fontWeight: 600 }}>{row.label}</td>
                <td>{row.data.pending.toLocaleString()}</td>
                <td>{row.data.progress.toLocaleString()}</td>
                <td>{row.data.completed.toLocaleString()}</td>
                <td>{row.data.failed.toLocaleString()}</td>
                <td>{row.data.total.toLocaleString()}</td>
              </GenerationTableRow>
            ) : null
          )}
        </tbody>
      </GenerationTable>

      {detailModal && (
        <UsageDetailModal
          type={detailModal}
          accountId={accountId}
          onClose={() => setDetailModal(null)}
        />
      )}
    </SectionCard>
  );
}

function DetailButton({
  onClick,
  children
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '2px 8px',
        fontSize: 11,
        fontWeight: 600,
        color: '#6366f1',
        background: 'none',
        border: '1px solid #e0e7ff',
        borderRadius: 6,
        cursor: 'pointer'
      }}
    >
      {children}
    </button>
  );
}
