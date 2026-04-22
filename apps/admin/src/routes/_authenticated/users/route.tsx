import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { Flex, Button, Skeleton } from '@bichon/ds';
import {
  PageHeader,
  PageTitle,
  PageDescription,
  SectionCard,
  SectionHeader,
  SectionTitle,
  ProfileHeader,
  ProfileInfo,
  ProfileAvatar,
  ProfileDetails,
  ProfileName,
  ProfileEmail,
  ProfileBadges,
  ProfileMeta,
  MetaItem,
  MetaLabel,
  MetaValue,
  Input,
  PageLayout,
  MainContent,
  Table,
  TableHeader,
  TableHeaderCell,
  SortIcon,
  TableBody,
  TableRow,
  TableCell,
  PaginationContainer,
  PaginationButton,
  PaginationInfo,
  RoleBadge,
  ProviderBadge,
  CreditValue,
  EmptyState,
  TabNav,
  TabNavItem,
  BackButton
} from '@/routes/_authenticated/users/users.style';
import { getAllAccounts } from '@/api/authenticated/accounts';
import type {
  GetAccountResponse,
  GetAccountByAdminResponse,
  SortField,
  SortDirection
} from '@/schema/api/accounts/accounts';
import { PasswordGuard } from '@/components/PasswordGuard/PasswordGuard';
import { AccountInfoTab } from '@/routes/_authenticated/users/-components/AccountInfoTab';
import { SubscriptionTab } from '@/routes/_authenticated/users/-components/SubscriptionTab';
import { PaymentHistoryTab } from '@/routes/_authenticated/users/-components/PaymentHistoryTab';
import { UsageTab } from '@/routes/_authenticated/users/-components/UsageTab';

export const Route = createFileRoute('/_authenticated/users')({
  component: UsersPage
});

const ROLE_LABEL: Record<string, string> = {
  FREE: '무료',
  SUB: '구독',
  MONTHLY_PASS: '월간 패스',
  SEASON_PASS: '시즌 패스',
  ADMIN: '관리자'
};

const getRoleLabel = (role: string) => ROLE_LABEL[role] ?? role;

// 프론트엔드 컬럼명 -> 백엔드 SortField 매핑
const SORT_FIELD_MAP: Record<string, SortField> = {
  accountId: 'ID',
  email: 'EMAIL',
  name: 'NAME',
  freeCredit: 'FREE_CREDIT',
  paidCredit: 'PAID_CREDIT',
  role: 'ROLE'
};

type ColumnField = 'accountId' | 'email' | 'name' | 'freeCredit' | 'paidCredit' | 'role';
type DetailTab = 'credit' | 'subscription' | 'usage';

const PAGE_SIZE = 30;

function UsersPage() {
  const navigate = useNavigate();
  const [selectedAccount, setSelectedAccount] =
    useState<GetAccountResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState<ColumnField | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<SortDirection>('DESC');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<DetailTab>('credit');

  // 전체 사용자 목록 조회
  const {
    data: accountsData,
    isLoading: isLoadingAccounts
  } = useQuery({
    queryKey: ['accounts', currentPage, searchQuery, sortBy, sortOrder],
    queryFn: () =>
      getAllAccounts({
        page: currentPage,
        size: PAGE_SIZE,
        email: searchQuery || undefined,
        sort: sortBy ? SORT_FIELD_MAP[sortBy] : undefined,
        direction: sortBy ? sortOrder : undefined
      })
  });

  // 검색 버튼 클릭 핸들러
  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
    setCurrentPage(0);
  };

  // 엔터 키 검색 핸들러
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 검색 초기화 핸들러
  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(0);
  };

  // 서버에서 정렬과 필터링 모두 처리
  const accounts = accountsData?.data.accountPage.content ?? [];
  const totalPages = accountsData?.data.accountPage.totalPages ?? 0;
  const totalElements = accountsData?.data.accountPage.totalElements ?? 0;

  const selectAccount = (account: GetAccountResponse) => {
    setSelectedAccount(account);
    setActiveTab('credit');
  };

  const selectAccountFromList = (account: GetAccountByAdminResponse) => {
    const converted: GetAccountResponse = {
      accountId: account.accountId,
      email: account.email,
      provider: account.provider,
      name: account.name,
      language: account.language,
      role: account.role,
      freeCredit: account.freeCredit,
      paidCredit: account.paidCredit,
      paddleCustomerId: account.paddleCustomerId,
      freeUserCreditRefillAt: account.freeUserCreditRefillAt
    };
    selectAccount(converted);
  };

  const handleSort = (field: ColumnField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowClick = (account: GetAccountByAdminResponse) => {
    selectAccountFromList(account);
  };

  const clearSelection = () => {
    setSelectedAccount(null);
  };

  const handleCreditUpdate = (freeCredit: number, paidCredit: number) => {
    if (selectedAccount) {
      setSelectedAccount({
        ...selectedAccount,
        freeCredit,
        paidCredit
      });
    }
  };

  const handleRoleUpdate = (role: string) => {
    if (selectedAccount) {
      setSelectedAccount({
        ...selectedAccount,
        role: role as GetAccountResponse['role']
      });
    }
  };

  // 구독 수정 후 accounts 리스트가 갱신되면 selectedAccount도 동기화
  const handleSubscriptionUpdate = () => {
    if (!selectedAccount) return;
    const updated = accounts.find(
      (a) => a.accountId === selectedAccount.accountId
    );
    if (updated) {
      setSelectedAccount({
        accountId: updated.accountId,
        email: updated.email,
        provider: updated.provider,
        name: updated.name,
        language: updated.language,
        role: updated.role,
        freeCredit: updated.freeCredit,
        paidCredit: updated.paidCredit,
        paddleCustomerId: updated.paddleCustomerId,
        freeUserCreditRefillAt: updated.freeUserCreditRefillAt
      });
    }
  };

  // 페이지네이션 버튼 렌더링
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

  return (
    <PasswordGuard
      description="사용자 관리 페이지에 접근하려면 관리자 패스워드가 필요합니다."
      onCancel={() => navigate({ to: '/main' })}
    >
      <PageLayout>
        <MainContent>
          <Flex direction="column" gap={24}>
            <PageHeader>
              <div>
                <PageTitle>사용자 관리</PageTitle>
                <PageDescription>
                  사용자를 검색하거나 목록에서 선택하여 크레딧을 관리하세요.
                </PageDescription>
              </div>
            </PageHeader>

            {/* 선택된 계정 정보 */}
            {selectedAccount && (
              <Flex direction="column" gap={16}>
                {/* 프로필 카드 */}
                <SectionCard>
                  <ProfileHeader>
                    <ProfileInfo>
                      <BackButton onClick={clearSelection}>
                        &larr; 사용자 목록
                      </BackButton>
                    </ProfileInfo>
                  </ProfileHeader>
                  <ProfileHeader style={{ marginTop: 12 }}>
                    <ProfileInfo>
                      <ProfileAvatar>
                        {(selectedAccount.name ?? selectedAccount.email).charAt(0).toUpperCase()}
                      </ProfileAvatar>
                      <ProfileDetails>
                        <ProfileName>
                          {selectedAccount.name || selectedAccount.email.split('@')[0]}
                        </ProfileName>
                        <ProfileEmail>{selectedAccount.email}</ProfileEmail>
                        <ProfileBadges>
                          <RoleBadge $role={selectedAccount.role}>
                            {getRoleLabel(selectedAccount.role)}
                          </RoleBadge>
                          <ProviderBadge $provider={selectedAccount.provider}>
                            {selectedAccount.provider}
                          </ProviderBadge>
                        </ProfileBadges>
                      </ProfileDetails>
                    </ProfileInfo>
                  </ProfileHeader>
                  <ProfileMeta>
                    <MetaItem>
                      <MetaLabel>ID</MetaLabel>
                      <MetaValue>{selectedAccount.accountId}</MetaValue>
                    </MetaItem>
                    <MetaItem>
                      <MetaLabel>언어</MetaLabel>
                      <MetaValue>{selectedAccount.language}</MetaValue>
                    </MetaItem>
                    <MetaItem>
                      <MetaLabel>무료 크레딧</MetaLabel>
                      <CreditValue $type="free">
                        {selectedAccount.freeCredit.toLocaleString()}
                      </CreditValue>
                    </MetaItem>
                    <MetaItem>
                      <MetaLabel>유료 크레딧</MetaLabel>
                      <CreditValue $type="paid">
                        {selectedAccount.paidCredit.toLocaleString()}
                      </CreditValue>
                    </MetaItem>
                    {selectedAccount.freeUserCreditRefillAt && (
                      <MetaItem>
                        <MetaLabel>재충전일</MetaLabel>
                        <MetaValue>
                          {new Date(
                            selectedAccount.freeUserCreditRefillAt
                          ).toLocaleDateString('ko-KR')}
                        </MetaValue>
                      </MetaItem>
                    )}
                  </ProfileMeta>

                  {/* 탭 네비게이션 */}
                  <TabNav style={{ marginTop: 20 }}>
                    <TabNavItem
                      $active={activeTab === 'credit'}
                      onClick={() => setActiveTab('credit')}
                    >
                      계정 관리
                    </TabNavItem>
                    <TabNavItem
                      $active={activeTab === 'subscription'}
                      onClick={() => setActiveTab('subscription')}
                    >
                      구독/결제
                    </TabNavItem>
                    <TabNavItem
                      $active={activeTab === 'usage'}
                      onClick={() => setActiveTab('usage')}
                    >
                      사용량
                    </TabNavItem>
                  </TabNav>
                </SectionCard>

                {/* 탭 콘텐츠 */}
                {activeTab === 'credit' && (
                  <SectionCard>
                    <SectionHeader>
                      <SectionTitle>계정 관리</SectionTitle>
                    </SectionHeader>
                    <AccountInfoTab
                      key={selectedAccount.accountId}
                      selectedAccount={selectedAccount}
                      onCreditUpdate={handleCreditUpdate}
                      onRoleUpdate={handleRoleUpdate}
                    />
                  </SectionCard>
                )}

                {activeTab === 'subscription' && (
                  <>
                    <SubscriptionTab
                      accountId={selectedAccount.accountId}
                      onUpdate={handleSubscriptionUpdate}
                    />
                    <PaymentHistoryTab accountId={selectedAccount.accountId} />
                  </>
                )}

                {activeTab === 'usage' && (
                  <UsageTab accountId={selectedAccount.accountId} />
                )}
              </Flex>
            )}

            {/* 사용자 목록 테이블 */}
            <SectionCard>
              <Flex direction="column" gap={16}>
                <Flex justify="space-between" alignItems="center">
                  <SectionTitle>전체 사용자 목록</SectionTitle>
                  <Flex gap={12} alignItems="center">
                    <Input
                      type="text"
                      placeholder="이메일로 검색"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      style={{ width: 250 }}
                    />
                    <Button
                      type="button"
                      variant="filled"
                      size="medium"
                      onClick={handleSearch}
                    >
                      검색
                    </Button>
                    {searchQuery && (
                      <Button
                        type="button"
                        variant="outlined"
                        size="medium"
                        onClick={handleClearSearch}
                      >
                        초기화
                      </Button>
                    )}
                    <PaginationInfo>
                      {searchQuery
                        ? `검색 결과: ${totalElements.toLocaleString()}명`
                        : `총 ${totalElements.toLocaleString()}명`}
                    </PaginationInfo>
                  </Flex>
                </Flex>

                <Table>
                  <TableHeader>
                    <tr>
                      <TableHeaderCell
                        $sortable
                        onClick={() => handleSort('accountId')}
                      >
                        ID
                        <SortIcon
                          $active={sortBy === 'accountId'}
                          $direction={sortBy === 'accountId' ? sortOrder : 'ASC'}
                        >
                          ▲
                        </SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell
                        $sortable
                        onClick={() => handleSort('email')}
                      >
                        이메일
                        <SortIcon
                          $active={sortBy === 'email'}
                          $direction={sortBy === 'email' ? sortOrder : 'ASC'}
                        >
                          ▲
                        </SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell
                        $sortable
                        onClick={() => handleSort('name')}
                      >
                        이름
                        <SortIcon
                          $active={sortBy === 'name'}
                          $direction={sortBy === 'name' ? sortOrder : 'ASC'}
                        >
                          ▲
                        </SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell>Provider</TableHeaderCell>
                      <TableHeaderCell
                        $sortable
                        onClick={() => handleSort('role')}
                      >
                        역할
                        <SortIcon
                          $active={sortBy === 'role'}
                          $direction={sortBy === 'role' ? sortOrder : 'ASC'}
                        >
                          ▲
                        </SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell
                        $sortable
                        onClick={() => handleSort('freeCredit')}
                      >
                        무료 크레딧
                        <SortIcon
                          $active={sortBy === 'freeCredit'}
                          $direction={sortBy === 'freeCredit' ? sortOrder : 'ASC'}
                        >
                          ▲
                        </SortIcon>
                      </TableHeaderCell>
                      <TableHeaderCell
                        $sortable
                        onClick={() => handleSort('paidCredit')}
                      >
                        유료 크레딧
                        <SortIcon
                          $active={sortBy === 'paidCredit'}
                          $direction={sortBy === 'paidCredit' ? sortOrder : 'ASC'}
                        >
                          ▲
                        </SortIcon>
                      </TableHeaderCell>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {isLoadingAccounts ? (
                      <>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={`skeleton-${i}`}>
                            <TableCell><Skeleton loading width={40} height={16} /></TableCell>
                            <TableCell><Skeleton loading width={180} height={16} /></TableCell>
                            <TableCell><Skeleton loading width={80} height={16} /></TableCell>
                            <TableCell><Skeleton loading width={60} height={22} /></TableCell>
                            <TableCell><Skeleton loading width={60} height={22} /></TableCell>
                            <TableCell><Skeleton loading width={70} height={16} /></TableCell>
                            <TableCell><Skeleton loading width={70} height={16} /></TableCell>
                          </TableRow>
                        ))}
                      </>
                    ) : accounts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <EmptyState>사용자가 없습니다.</EmptyState>
                        </TableCell>
                      </TableRow>
                    ) : (
                      accounts.map((account) => (
                        <TableRow
                          key={account.accountId}
                          $clickable
                          $selected={
                            selectedAccount?.accountId === account.accountId
                          }
                          onClick={() => handleRowClick(account)}
                        >
                          <TableCell>{account.accountId}</TableCell>
                          <TableCell title={account.email}>
                            {account.email}
                          </TableCell>
                          <TableCell>{account.name || '-'}</TableCell>
                          <TableCell>
                            <ProviderBadge $provider={account.provider}>
                              {account.provider}
                            </ProviderBadge>
                          </TableCell>
                          <TableCell>
                            <RoleBadge $role={account.role}>
                              {getRoleLabel(account.role)}
                            </RoleBadge>
                          </TableCell>
                          <TableCell>
                            <CreditValue $type="free">
                              {account.freeCredit.toLocaleString()}
                            </CreditValue>
                          </TableCell>
                          <TableCell>
                            <CreditValue $type="paid">
                              {account.paidCredit.toLocaleString()}
                            </CreditValue>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <PaginationContainer>
                    <PaginationButton
                      onClick={() => handlePageChange(0)}
                      disabled={currentPage === 0}
                    >
                      «
                    </PaginationButton>
                    <PaginationButton
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                    >
                      ‹
                    </PaginationButton>

                    {paginationButtons.map((page, index) =>
                      page === 'ellipsis' ? (
                        <PaginationInfo key={`ellipsis-${index}`}>
                          ...
                        </PaginationInfo>
                      ) : (
                        <PaginationButton
                          key={page}
                          $active={currentPage === page}
                          onClick={() => handlePageChange(page)}
                        >
                          {page + 1}
                        </PaginationButton>
                      )
                    )}

                    <PaginationButton
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages - 1}
                    >
                      ›
                    </PaginationButton>
                    <PaginationButton
                      onClick={() => handlePageChange(totalPages - 1)}
                      disabled={currentPage === totalPages - 1}
                    >
                      »
                    </PaginationButton>
                  </PaginationContainer>
                )}
              </Flex>
            </SectionCard>
          </Flex>
        </MainContent>
      </PageLayout>
    </PasswordGuard>
  );
}
