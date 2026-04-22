import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { Flex } from '@docs-front/ui';
import { FileText } from 'lucide-react';
import {
  StyledAdminHeader,
  StyledAdminTitle,
  StyledAdminSubtitle,
  StyledOperatorBadge,
  StyledFilterBar,
  StyledFilterSelect,
  StyledSearchInput,
  StyledTableWrapper,
  StyledTable,
  StyledBadge,
  StyledKpiGrid,
  StyledKpiCard,
  StyledKpiLabel,
  StyledKpiValue,
  StyledKpiSub,
  colors,
} from '../-admin.style';
import { ALL_DOCUMENTS, formatDateTime } from '../-components/mockData';

export const Route = createFileRoute('/_authenticated/admin-demo/documents')({
  component: DocumentsPage,
});

type StateFilter = 'all' | '초안' | '검토중' | '완료';
type ScoreFilter = 'all' | 'high' | 'mid' | 'low';

function DocumentsPage() {
  const navigate = useNavigate();
  const [stateFilter, setStateFilter] = useState<StateFilter>('all');
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return ALL_DOCUMENTS.filter((d) => {
      if (stateFilter !== 'all' && d.state !== stateFilter) return false;
      if (scoreFilter === 'high' && d.qualityScore < 85) return false;
      if (scoreFilter === 'mid' && (d.qualityScore < 75 || d.qualityScore >= 85)) return false;
      if (scoreFilter === 'low' && d.qualityScore >= 75) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (!d.title.toLowerCase().includes(q) && !d.authorName.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [stateFilter, scoreFilter, search]);

  // KPI 집계
  const total = ALL_DOCUMENTS.length;
  const avgScore = (ALL_DOCUMENTS.reduce((s, d) => s + d.qualityScore, 0) / total).toFixed(1);
  const completed = ALL_DOCUMENTS.filter((d) => d.state === '완료').length;
  const thisWeek = ALL_DOCUMENTS.filter((d) => {
    const dt = new Date(d.createdAt);
    const diff = (Date.now() - dt.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;

  return (
    <>
      <StyledAdminHeader>
        <div>
          <StyledAdminTitle>생성 문서 현황</StyledAdminTitle>
          <StyledAdminSubtitle>
            전체 {total.toLocaleString()}건 중 {filtered.length}건 표시 · 생성된 모든 R&D 계획서 조회
          </StyledAdminSubtitle>
        </div>
        <StyledOperatorBadge>운영자 · 홍길동</StyledOperatorBadge>
      </StyledAdminHeader>

      {/* KPI 4개 */}
      <StyledKpiGrid>
        <StyledKpiCard>
          <StyledKpiLabel>
            <FileText size={14} strokeWidth={2} color={colors.textMuted} />
            누적 생성 수
          </StyledKpiLabel>
          <StyledKpiValue>{total.toLocaleString()}<span style={{ fontSize: 14, fontWeight: 500, color: colors.textMuted, marginLeft: 4 }}>건</span></StyledKpiValue>
          <StyledKpiSub>최근 7일 {thisWeek}건</StyledKpiSub>
        </StyledKpiCard>
        <StyledKpiCard>
          <StyledKpiLabel>
            평균 AI 품질 점수
          </StyledKpiLabel>
          <StyledKpiValue>{avgScore}<span style={{ fontSize: 14, fontWeight: 500, color: colors.textMuted, marginLeft: 4 }}>점</span></StyledKpiValue>
          <StyledKpiSub $positive>지난달 대비 +2.1</StyledKpiSub>
        </StyledKpiCard>
        <StyledKpiCard>
          <StyledKpiLabel>
            완료된 계획서
          </StyledKpiLabel>
          <StyledKpiValue>{completed}<span style={{ fontSize: 14, fontWeight: 500, color: colors.textMuted, marginLeft: 4 }}>건</span></StyledKpiValue>
          <StyledKpiSub>전체의 {((completed / total) * 100).toFixed(0)}%</StyledKpiSub>
        </StyledKpiCard>
        <StyledKpiCard>
          <StyledKpiLabel>
            고품질 (85점 이상)
          </StyledKpiLabel>
          <StyledKpiValue>
            {ALL_DOCUMENTS.filter((d) => d.qualityScore >= 85).length}
            <span style={{ fontSize: 14, fontWeight: 500, color: colors.textMuted, marginLeft: 4 }}>건</span>
          </StyledKpiValue>
          <StyledKpiSub>
            {((ALL_DOCUMENTS.filter((d) => d.qualityScore >= 85).length / total) * 100).toFixed(0)}% 비율
          </StyledKpiSub>
        </StyledKpiCard>
      </StyledKpiGrid>

      <StyledFilterBar>
        <StyledSearchInput
          placeholder="제목, 작성자 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <StyledFilterSelect value={stateFilter} onChange={(e) => setStateFilter(e.target.value as StateFilter)}>
          <option value="all">전체 상태</option>
          <option value="초안">초안</option>
          <option value="검토중">검토중</option>
          <option value="완료">완료</option>
        </StyledFilterSelect>
        <StyledFilterSelect value={scoreFilter} onChange={(e) => setScoreFilter(e.target.value as ScoreFilter)}>
          <option value="all">전체 점수</option>
          <option value="high">85점 이상 (우수)</option>
          <option value="mid">75~84점 (보통)</option>
          <option value="low">75점 미만 (미흡)</option>
        </StyledFilterSelect>
      </StyledFilterBar>

      <StyledTableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <th style={{ width: '54%' }}>제목</th>
              <th style={{ width: '18%' }}>작성자</th>
              <th style={{ width: '14%' }}>생성일시</th>
              <th style={{ width: '7%', textAlign: 'right' }}>점수</th>
              <th style={{ width: '7%', textAlign: 'center' }}>상태</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 100).map((d) => (
              <tr
                key={d.id}
                onClick={() => navigate({ to: '/admin-demo/users/$userId' as any, params: { userId: d.authorId } })}
              >
                <td style={{ fontSize: 13, fontWeight: 500, color: colors.text }}>{d.title}</td>
                <td style={{ fontSize: 13, color: colors.text }}>{d.authorName}</td>
                <td style={{ fontSize: 13, color: colors.textMuted }}>{formatDateTime(d.createdAt)}</td>
                <td style={{ textAlign: 'right' }}>
                  <span style={{
                    fontSize: 13, fontWeight: 700,
                    color: d.qualityScore >= 85 ? '#16A34A' : d.qualityScore >= 75 ? '#D97706' : '#DC2626',
                  }}>
                    {d.qualityScore}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  {d.state === '완료' && <StyledBadge $variant="success">{d.state}</StyledBadge>}
                  {d.state === '검토중' && <StyledBadge $variant="info">{d.state}</StyledBadge>}
                  {d.state === '초안' && <StyledBadge $variant="neutral">{d.state}</StyledBadge>}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 48, color: colors.textMuted }}>
                  조건에 맞는 문서가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </StyledTable>
      </StyledTableWrapper>
      {filtered.length > 100 && (
        <div style={{ textAlign: 'center', padding: '16px 0 0', fontSize: 12, color: colors.textMuted }}>
          상위 100건만 표시 · 전체 {filtered.length.toLocaleString()}건
        </div>
      )}
    </>
  );
}
