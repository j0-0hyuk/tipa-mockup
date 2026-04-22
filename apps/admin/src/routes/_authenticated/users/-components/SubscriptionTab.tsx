import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Flex, Button, useToast, Skeleton } from '@bichon/ds';
import {
  SectionCard,
  SectionHeader,
  SectionTitle,
  SectionDivider,
  SubscriptionGrid,
  SubscriptionItem,
  SubscriptionLabel,
  SubscriptionValue,
  SubscriptionTypeBadge,
  StatusBadge,
  FormField,
  Label,
  Input,
  RadioGroup,
  RadioLabel,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  EmptyState,
  ConfirmOverlay,
  ConfirmContent,
  ConfirmHeader,
  ConfirmTitle,
  ConfirmBody,
  ConfirmFooter,
  DiffTable,
  DiffRow,
  DiffLabel,
  DiffOldValue,
  DiffArrow,
  DiffNewValue
} from '@/routes/_authenticated/users/users.style';
import {
  getAccountSubscriptionUsage,
  updateAccountSubscription,
  createAccountSubscription
} from '@/api/authenticated/accounts';
import type {
  UpdateSubscriptionRequest,
  CreateSubscriptionRequest
} from '@/schema/api/accounts/subscription';

interface SubscriptionTabProps {
  accountId: number;
  onUpdate?: () => void;
}

const SUBSCRIPTION_TYPE_LABELS: Record<string, string> = {
  SUBSCRIPTION_M: '월간 구독',
  SUBSCRIPTION_Y: '연간 구독',
  MONTHLY_PASS: '월간 패스',
  SEASON_PASS: '시즌 패스'
};

const toDatetimeLocal = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formatDateTime = (dateStr: string | null) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}.${month}.${day} ${hours}:${minutes}`;
};

// 말일 클램프: 1/31 + 1개월 → 2/28(29), 3/31 + 1개월 → 4/30 등
const addMonthsClamped = (base: Date, months: number): Date => {
  const result = new Date(base.getTime());
  const originalDay = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(originalDay, lastDay));
  return result;
};

const getDefaultDates = (type: 'MONTHLY_PASS' | 'SEASON_PASS') => {
  const now = new Date();
  const startsAt = toDatetimeLocal(now);
  if (type === 'MONTHLY_PASS') {
    return { startsAt, endsAt: toDatetimeLocal(addMonthsClamped(now, 1)) };
  } else {
    const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59);
    return { startsAt, endsAt: toDatetimeLocal(yearEnd) };
  }
};

type ModalKind = 'update-ends-at' | 'create-subscription';

interface PendingUpdate {
  endsAt: string;
  params: UpdateSubscriptionRequest;
}

export function SubscriptionTab({ accountId, onUpdate }: SubscriptionTabProps) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [editEndsAt, setEditEndsAt] = useState('');
  const [pendingUpdate, setPendingUpdate] = useState<PendingUpdate | null>(null);

  const [newSubType, setNewSubType] = useState<'MONTHLY_PASS' | 'SEASON_PASS'>('MONTHLY_PASS');
  const [newStartsAt, setNewStartsAt] = useState('');
  const [newEndsAt, setNewEndsAt] = useState('');

  const [activeModal, setActiveModal] = useState<ModalKind | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['account-subscription', accountId],
    queryFn: () => getAccountSubscriptionUsage(accountId)
  });

  useEffect(() => {
    if (data) {
      setEditEndsAt(
        data.subscription?.endsAt
          ? data.subscription.endsAt.slice(0, 16)
          : ''
      );
    }
  }, [data]);

  const handleOpenCreateModal = () => {
    const defaults = getDefaultDates('MONTHLY_PASS');
    setNewSubType('MONTHLY_PASS');
    setNewStartsAt(defaults.startsAt);
    setNewEndsAt(defaults.endsAt);
    setActiveModal('create-subscription');
  };

  const handleSubTypeChange = (type: 'MONTHLY_PASS' | 'SEASON_PASS') => {
    setNewSubType(type);
    const defaults = getDefaultDates(type);
    setNewStartsAt(defaults.startsAt);
    setNewEndsAt(defaults.endsAt);
  };

  const updateMutation = useMutation({
    mutationFn: (params: UpdateSubscriptionRequest) =>
      updateAccountSubscription(accountId, params),
    onSuccess: () => {
      toast.showToast('만료일이 성공적으로 수정되었습니다.', {
        duration: 3000
      });
      queryClient.invalidateQueries({
        queryKey: ['account-subscription', accountId]
      });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      onUpdate?.();
      setActiveModal(null);
      setPendingUpdate(null);
    },
    onError: (error: Error) => {
      toast.showToast(`만료일 수정에 실패했습니다: ${error.message}`, {
        duration: 5000
      });
      setActiveModal(null);
      setPendingUpdate(null);
    }
  });

  const createMutation = useMutation({
    mutationFn: (params: CreateSubscriptionRequest) =>
      createAccountSubscription(accountId, params),
    onSuccess: () => {
      toast.showToast('구독이 성공적으로 추가되었습니다.', {
        duration: 3000
      });
      queryClient.invalidateQueries({
        queryKey: ['account-subscription', accountId]
      });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      onUpdate?.();
      setActiveModal(null);
      setNewStartsAt('');
      setNewEndsAt('');
    },
    onError: (error: Error) => {
      toast.showToast(`구독 추가에 실패했습니다: ${error.message}`, {
        duration: 5000
      });
      setActiveModal(null);
    }
  });

  const handleEndsAtSubmit = () => {
    if (!data?.subscription) return;

    const currentEndsAt = data.subscription.endsAt.slice(0, 16);
    if (editEndsAt === currentEndsAt) {
      toast.showToast('변경된 항목이 없습니다.', { duration: 3000 });
      return;
    }
    if (!editEndsAt) {
      toast.showToast('만료일을 입력해주세요.', { duration: 3000 });
      return;
    }

    const params: UpdateSubscriptionRequest = { endsAt: `${editEndsAt}:00+09:00` };
    setPendingUpdate({ endsAt: editEndsAt, params });
    setActiveModal('update-ends-at');
  };

  const handleCreateSubmit = () => {
    if (!newStartsAt || !newEndsAt) {
      toast.showToast('시작일과 만료일을 모두 입력해주세요.', { duration: 3000 });
      return;
    }
    createMutation.mutate({
      type: newSubType,
      startsAt: `${newStartsAt}:00+09:00`,
      endsAt: `${newEndsAt}:00+09:00`
    });
  };

  const handleUpdateConfirm = () => {
    if (pendingUpdate) {
      updateMutation.mutate(pendingUpdate.params);
    }
  };

  const handleModalClose = () => {
    setActiveModal(null);
    setPendingUpdate(null);
  };

  if (isLoading) {
    return (
      <SectionCard>
        <SectionHeader>
          <SectionTitle>구독/결제</SectionTitle>
        </SectionHeader>
        <Flex direction="column" gap={12}>
          <Skeleton loading width="100%" height={80} />
          <Flex gap={12}>
            <Skeleton loading width="100%" height={60} />
            <Skeleton loading width="100%" height={60} />
          </Flex>
        </Flex>
      </SectionCard>
    );
  }

  if (!data) {
    return (
      <SectionCard>
        <EmptyState>구독 정보를 불러올 수 없습니다.</EmptyState>
      </SectionCard>
    );
  }

  const { subscription, subscriptions } = data;

  return (
    <>
      <SectionCard>
        <SectionHeader>
          <SectionTitle>구독 정보</SectionTitle>
          <Button
            type="button"
            variant="outlined"
            size="small"
            onClick={handleOpenCreateModal}
          >
            + 구독 추가
          </Button>
        </SectionHeader>

        {subscription ? (
          <>
            <SubscriptionGrid>
              <SubscriptionItem>
                <SubscriptionLabel>구독 유형</SubscriptionLabel>
                <SubscriptionValue>
                  {SUBSCRIPTION_TYPE_LABELS[subscription.type] ?? subscription.type}
                </SubscriptionValue>
              </SubscriptionItem>
              <SubscriptionItem>
                <SubscriptionLabel>시작일</SubscriptionLabel>
                <SubscriptionValue>
                  {formatDateTime(subscription.startsAt)}
                </SubscriptionValue>
              </SubscriptionItem>
              <SubscriptionItem>
                <SubscriptionLabel>만료일</SubscriptionLabel>
                <SubscriptionValue>
                  {formatDateTime(subscription.endsAt)}
                </SubscriptionValue>
              </SubscriptionItem>
              <SubscriptionItem>
                <SubscriptionLabel>Paddle ID</SubscriptionLabel>
                <SubscriptionValue>
                  {subscription.paddleSubscriptionId ?? '-'}
                </SubscriptionValue>
              </SubscriptionItem>
            </SubscriptionGrid>

            <SectionDivider />

            <Flex gap={12} alignItems="flex-end">
              <FormField style={{ flex: 1 }}>
                <Label htmlFor="editEndsAt">
                  <Flex gap={6} alignItems="center" style={{ display: 'inline-flex' }}>
                    만료일 수정
                    <SubscriptionTypeBadge $type={subscription.type}>
                      {SUBSCRIPTION_TYPE_LABELS[subscription.type] ?? subscription.type}
                    </SubscriptionTypeBadge>
                  </Flex>
                </Label>
                <Input
                  id="editEndsAt"
                  type="datetime-local"
                  value={editEndsAt}
                  onChange={(e) => setEditEndsAt(e.target.value)}
                />
              </FormField>
              <div style={{ paddingBottom: '1px' }}>
                <Button
                  type="button"
                  variant="filled"
                  size="medium"
                  onClick={handleEndsAtSubmit}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? '수정 중...' : '수정'}
                </Button>
              </div>
            </Flex>
          </>
        ) : (
          <EmptyState style={{ padding: '16px' }}>
            활성 구독이 없습니다.
          </EmptyState>
        )}

        {subscriptions.length > 0 && (
          <>
            <SectionDivider />
            <SectionTitle style={{ fontSize: '14px', marginBottom: '12px' }}>
              구독 이력
            </SectionTitle>
            <Table>
              <TableHeader>
                <tr>
                  <TableHeaderCell>유형</TableHeaderCell>
                  <TableHeaderCell>상태</TableHeaderCell>
                  <TableHeaderCell>시작일</TableHeaderCell>
                  <TableHeaderCell>만료일</TableHeaderCell>
                  <TableHeaderCell>Paddle ID</TableHeaderCell>
                </tr>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => (
                  <TableRow key={sub.subscriptionId}>
                    <TableCell>
                      {SUBSCRIPTION_TYPE_LABELS[sub.type] ?? sub.type}
                    </TableCell>
                    <TableCell>
                      <StatusBadge $status={sub.status}>
                        {sub.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>{formatDateTime(sub.startsAt)}</TableCell>
                    <TableCell>{formatDateTime(sub.endsAt)}</TableCell>
                    <TableCell>{sub.paddleSubscriptionId ?? '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </SectionCard>

      {/* 만료일 수정 확인 모달 */}
      {activeModal === 'update-ends-at' && pendingUpdate && (
        <ConfirmOverlay onClick={handleModalClose}>
          <ConfirmContent onClick={(e) => e.stopPropagation()}>
            <ConfirmHeader>
              <ConfirmTitle>만료일 수정 확인</ConfirmTitle>
            </ConfirmHeader>
            <ConfirmBody>
              <DiffTable>
                <DiffRow>
                  <DiffLabel>만료일</DiffLabel>
                  <DiffOldValue>
                    {data.subscription?.endsAt
                      ? formatDateTime(data.subscription.endsAt)
                      : '-'}
                  </DiffOldValue>
                  <DiffArrow>&rarr;</DiffArrow>
                  <DiffNewValue>{formatDateTime(pendingUpdate.endsAt)}</DiffNewValue>
                </DiffRow>
              </DiffTable>
            </ConfirmBody>
            <ConfirmFooter>
              <Button
                type="button"
                variant="outlined"
                size="medium"
                onClick={handleModalClose}
              >
                취소
              </Button>
              <Button
                type="button"
                variant="filled"
                size="medium"
                onClick={handleUpdateConfirm}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? '수정 중...' : '수정 확인'}
              </Button>
            </ConfirmFooter>
          </ConfirmContent>
        </ConfirmOverlay>
      )}

      {/* 구독 추가 모달 */}
      {activeModal === 'create-subscription' && (
        <ConfirmOverlay onClick={handleModalClose}>
          <ConfirmContent onClick={(e) => e.stopPropagation()}>
            <ConfirmHeader>
              <ConfirmTitle>구독 추가</ConfirmTitle>
            </ConfirmHeader>
            <ConfirmBody>
              <Flex direction="column" gap={16}>
                <FormField>
                  <Label>구독 유형</Label>
                  <RadioGroup>
                    <RadioLabel $checked={newSubType === 'MONTHLY_PASS'}>
                      <input
                        type="radio"
                        name="subType"
                        value="MONTHLY_PASS"
                        checked={newSubType === 'MONTHLY_PASS'}
                        onChange={() => handleSubTypeChange('MONTHLY_PASS')}
                      />
                      월간 패스
                    </RadioLabel>
                    <RadioLabel $checked={newSubType === 'SEASON_PASS'}>
                      <input
                        type="radio"
                        name="subType"
                        value="SEASON_PASS"
                        checked={newSubType === 'SEASON_PASS'}
                        onChange={() => handleSubTypeChange('SEASON_PASS')}
                      />
                      시즌 패스
                    </RadioLabel>
                  </RadioGroup>
                </FormField>

                <FormField>
                  <Label htmlFor="newStartsAt">시작일</Label>
                  <Input
                    id="newStartsAt"
                    type="datetime-local"
                    value={newStartsAt}
                    onChange={(e) => setNewStartsAt(e.target.value)}
                  />
                </FormField>

                <FormField>
                  <Label htmlFor="newEndsAt">만료일</Label>
                  <Input
                    id="newEndsAt"
                    type="datetime-local"
                    value={newEndsAt}
                    onChange={(e) => setNewEndsAt(e.target.value)}
                  />
                </FormField>

                {(newStartsAt || newEndsAt) && (
                  <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 8, fontSize: 13, color: '#475569' }}>
                    <SubscriptionTypeBadge $type={newSubType} style={{ marginRight: 8 }}>
                      {newSubType === 'MONTHLY_PASS' ? '월간 패스' : '시즌 패스'}
                    </SubscriptionTypeBadge>
                    {newStartsAt && (
                      <span style={{ marginRight: 12 }}>
                        시작: {formatDateTime(newStartsAt)}
                      </span>
                    )}
                    {newEndsAt && (
                      <span>
                        만료: {formatDateTime(newEndsAt)}
                      </span>
                    )}
                  </div>
                )}
              </Flex>
            </ConfirmBody>
            <ConfirmFooter>
              <Button
                type="button"
                variant="outlined"
                size="medium"
                onClick={handleModalClose}
              >
                취소
              </Button>
              <Button
                type="button"
                variant="filled"
                size="medium"
                onClick={handleCreateSubmit}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? '추가 중...' : '구독 추가'}
              </Button>
            </ConfirmFooter>
          </ConfirmContent>
        </ConfirmOverlay>
      )}
    </>
  );
}
