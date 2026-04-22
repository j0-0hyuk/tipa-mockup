import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { Flex } from '@docs-front/ui';
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
  colors,
} from '../-admin.style';
import { USERS, formatDate, timeAgo } from '../-components/mockData';

export const Route = createFileRoute('/_authenticated/admin-demo/users/')({
  component: UsersListPage,
});

type StatusFilter = 'all' | 'active' | 'dormant' | 'new';

function UsersListPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return USERS.filter((u) => {
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [statusFilter, search]);

  return (
    <>
      <StyledAdminHeader>
        <div>
          <StyledAdminTitle>사용자 관리</StyledAdminTitle>
          <StyledAdminSubtitle>
            전체 {USERS.length}명 중 {filtered.length}명 표시 · 가입 사용자 활동 및 사용량 조회
          </StyledAdminSubtitle>
        </div>
        <StyledOperatorBadge>운영자 · 홍길동</StyledOperatorBadge>
      </StyledAdminHeader>

      <StyledFilterBar>
        <StyledSearchInput
          placeholder="이름, 이메일 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <StyledFilterSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}>
          <option value="all">전체 상태</option>
          <option value="active">활성</option>
          <option value="new">신규</option>
          <option value="dormant">휴면</option>
        </StyledFilterSelect>
      </StyledFilterBar>

      <StyledTableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <th style={{ width: '34%' }}>사용자</th>
              <th style={{ width: '14%' }}>가입일</th>
              <th style={{ width: '16%' }}>마지막 접속</th>
              <th style={{ width: '12%', textAlign: 'right' }}>총 문서</th>
              <th style={{ width: '12%', textAlign: 'right' }}>이번 달</th>
              <th style={{ width: '12%', textAlign: 'center' }}>상태</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} onClick={() => navigate({ to: '/admin-demo/users/$userId' as any, params: { userId: u.id } })}>
                <td>
                  <Flex alignItems="center" gap="10px">
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: '#E0EBFF', color: colors.main,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, letterSpacing: '-0.02em', flexShrink: 0,
                    }}>
                      {u.name.slice(0, 1)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, letterSpacing: '-0.02em' }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: 11, color: colors.textMuted, letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {u.email}
                      </div>
                    </div>
                  </Flex>
                </td>
                <td style={{ fontSize: 13, color: colors.textMuted }}>{formatDate(u.joinedAt)}</td>
                <td style={{ fontSize: 13, color: colors.textMuted }}>{timeAgo(u.lastAccessAt)}</td>
                <td style={{ fontSize: 13, fontWeight: 600, color: colors.text, textAlign: 'right' }}>{u.totalDocs}건</td>
                <td style={{ fontSize: 13, color: colors.textMuted, textAlign: 'right' }}>{u.docsThisMonth}건</td>
                <td style={{ textAlign: 'center' }}>
                  {u.status === 'active' && <StyledBadge $variant="success">활성</StyledBadge>}
                  {u.status === 'new' && <StyledBadge $variant="info">신규</StyledBadge>}
                  {u.status === 'dormant' && <StyledBadge $variant="warn">휴면</StyledBadge>}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 48, color: colors.textMuted }}>
                  조건에 맞는 사용자가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </StyledTable>
      </StyledTableWrapper>
    </>
  );
}
