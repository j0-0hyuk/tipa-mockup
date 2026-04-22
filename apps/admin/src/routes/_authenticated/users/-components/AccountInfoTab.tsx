import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { Flex, Button, useToast } from '@bichon/ds';
import {
  FormField,
  Label,
  Input,
  Select,
  ErrorMessage,
  QuickActionButtons,
  QuickActionButton,
  SectionDivider,
  SectionTitle,
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
  DiffNewValue,
  WarningText
} from '@/routes/_authenticated/users/users.style';
import { updateAccountCredit, updateAccountSubscription } from '@/api/authenticated/accounts';
import {
  updateAccountCreditRequestSchema,
  type GetAccountResponse
} from '@/schema/api/accounts/accounts';
import { accountRoleSchema } from '@/schema/api/accounts/subscription';

type AccountRole = z.infer<typeof accountRoleSchema>;

const ROLE_LABEL: Record<string, string> = {
  FREE: '무료',
  SUB: '구독',
  MONTHLY_PASS: '월간 패스',
  SEASON_PASS: '시즌 패스',
  ADMIN: '관리자'
};

const getRoleLabel = (role: string) => ROLE_LABEL[role] ?? role;
type CreditFormData = z.infer<typeof updateAccountCreditRequestSchema>;

interface AccountInfoTabProps {
  selectedAccount: GetAccountResponse;
  onCreditUpdate: (freeCredit: number, paidCredit: number) => void;
  onRoleUpdate: (role: AccountRole) => void;
}

interface PendingConfirm {
  role?: AccountRole;
  creditData?: CreditFormData;
}

export function AccountInfoTab({
  selectedAccount,
  onCreditUpdate,
  onRoleUpdate
}: AccountInfoTabProps) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const [editRole, setEditRole] = useState<AccountRole>(selectedAccount.role as AccountRole);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch
  } = useForm<CreditFormData>({
    resolver: zodResolver(updateAccountCreditRequestSchema),
    defaultValues: {
      accountId: selectedAccount.accountId,
      freeCredit: selectedAccount.freeCredit,
      paidCredit: selectedAccount.paidCredit
    }
  });

  const currentFreeCredit = watch('freeCredit');
  const currentPaidCredit = watch('paidCredit');

  // selectedAccount가 외부에서 변경될 때(mutation 성공 후) form 상태 동기화
  useEffect(() => {
    setEditRole(selectedAccount.role as AccountRole);
    reset({
      accountId: selectedAccount.accountId,
      freeCredit: selectedAccount.freeCredit,
      paidCredit: selectedAccount.paidCredit
    });
  }, [
    selectedAccount.accountId,
    selectedAccount.role,
    selectedAccount.freeCredit,
    selectedAccount.paidCredit
  ]);

  const addCredit = (type: 'freeCredit' | 'paidCredit', amount: number) => {
    const currentValue =
      type === 'freeCredit' ? currentFreeCredit : currentPaidCredit;
    const baseValue =
      currentValue ??
      (type === 'freeCredit'
        ? selectedAccount.freeCredit
        : selectedAccount.paidCredit) ??
      0;
    setValue(type, baseValue + amount);
  };

  const combinedMutation = useMutation({
    mutationFn: async (vars: PendingConfirm) => {
      let roleSucceeded = false;
      let creditSucceeded = false;
      let lastError: Error | null = null;

      if (vars.role) {
        try {
          await updateAccountSubscription(selectedAccount.accountId, { role: vars.role });
          roleSucceeded = true;
        } catch (e) {
          lastError = e as Error;
        }
      }

      if (vars.creditData) {
        try {
          await updateAccountCredit(vars.creditData);
          creditSucceeded = true;
        } catch (e) {
          lastError = e as Error;
        }
      }

      return { vars, roleSucceeded, creditSucceeded, lastError };
    },
    onSuccess: ({ vars, roleSucceeded, creditSucceeded, lastError }) => {
      const messages: string[] = [];

      if (roleSucceeded && vars.role) {
        onRoleUpdate(vars.role);
        messages.push('Role');
      }
      if (creditSucceeded && vars.creditData) {
        onCreditUpdate(
          vars.creditData.freeCredit ?? selectedAccount.freeCredit,
          vars.creditData.paidCredit ?? selectedAccount.paidCredit
        );
        messages.push('크레딧');
      }

      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({
        queryKey: ['account-subscription', selectedAccount.accountId]
      });

      if (lastError) {
        const successPart = messages.length > 0 ? `${messages.join(', ')} 수정 완료. ` : '';
        toast.showToast(`${successPart}일부 항목 수정에 실패했습니다: ${lastError.message}`, {
          duration: 5000
        });
      } else if (messages.length > 0) {
        toast.showToast(`${messages.join(', ')}이(가) 성공적으로 수정되었습니다.`, {
          duration: 3000
        });
      }

      setShowConfirm(false);
      setPending(null);
    },
    onError: (error: Error) => {
      toast.showToast(`수정에 실패했습니다: ${error.message}`, {
        duration: 5000
      });
      setShowConfirm(false);
      setPending(null);
    }
  });

  const onFormSubmit = (creditData: CreditFormData) => {
    const roleChanged = editRole !== (selectedAccount.role as AccountRole);
    const freeCreditChanged = creditData.freeCredit !== selectedAccount.freeCredit;
    const paidCreditChanged = creditData.paidCredit !== selectedAccount.paidCredit;

    if (!roleChanged && !freeCreditChanged && !paidCreditChanged) {
      toast.showToast('변경된 항목이 없습니다.', { duration: 3000 });
      return;
    }

    setPending({
      role: roleChanged ? editRole : undefined,
      creditData: (freeCreditChanged || paidCreditChanged) ? creditData : undefined
    });
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (pending) {
      combinedMutation.mutate(pending);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setPending(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        {/* Role 관리 */}
        <SectionTitle style={{ fontSize: '14px', marginBottom: '12px' }}>
          Role 관리
        </SectionTitle>
        <FormField>
          <Label htmlFor="editRole">Role</Label>
          <Select
            id="editRole"
            value={editRole}
            onChange={(e) => setEditRole(e.target.value as AccountRole)}
          >
            <option value="FREE">무료</option>
            <option value="SUB">구독</option>
            <option value="MONTHLY_PASS">월간 패스</option>
            <option value="SEASON_PASS">시즌 패스</option>
            <option value="ADMIN">관리자</option>
          </Select>
        </FormField>

        <SectionDivider />

        {/* 크레딧 관리 */}
        <SectionTitle style={{ fontSize: '14px', marginBottom: '12px' }}>
          크레딧 관리
        </SectionTitle>
        <Flex gap={12} alignItems="flex-start">
          <FormField style={{ flex: 1 }}>
            <Label htmlFor="freeCredit">무료 크레딧</Label>
            <Input
              id="freeCredit"
              type="number"
              step="1"
              {...register('freeCredit', { valueAsNumber: true })}
            />
            <QuickActionButtons>
              <QuickActionButton
                type="button"
                onClick={() => addCredit('freeCredit', 1000)}
              >
                +1,000
              </QuickActionButton>
              <QuickActionButton
                type="button"
                onClick={() => addCredit('freeCredit', 10000)}
              >
                +10,000
              </QuickActionButton>
            </QuickActionButtons>
            {errors.freeCredit && (
              <ErrorMessage>{errors.freeCredit.message}</ErrorMessage>
            )}
          </FormField>

          <FormField style={{ flex: 1 }}>
            <Label htmlFor="paidCredit">유료 크레딧</Label>
            <Input
              id="paidCredit"
              type="number"
              step="1"
              {...register('paidCredit', { valueAsNumber: true })}
            />
            <QuickActionButtons>
              <QuickActionButton
                type="button"
                onClick={() => addCredit('paidCredit', 1000)}
              >
                +1,000
              </QuickActionButton>
              <QuickActionButton
                type="button"
                onClick={() => addCredit('paidCredit', 10000)}
              >
                +10,000
              </QuickActionButton>
            </QuickActionButtons>
            {errors.paidCredit && (
              <ErrorMessage>{errors.paidCredit.message}</ErrorMessage>
            )}
          </FormField>
        </Flex>

        <Flex justify="flex-end" style={{ marginTop: 16 }}>
          <Button
            type="submit"
            variant="filled"
            size="medium"
            disabled={combinedMutation.isPending}
          >
            {combinedMutation.isPending ? '수정 중...' : '수정'}
          </Button>
        </Flex>
      </form>

      {showConfirm && pending && (
        <ConfirmOverlay onClick={handleCancel}>
          <ConfirmContent onClick={(e) => e.stopPropagation()}>
            <ConfirmHeader>
              <ConfirmTitle>계정 정보 수정 확인</ConfirmTitle>
            </ConfirmHeader>
            <ConfirmBody>
              <DiffTable>
                {pending.role && (
                  <DiffRow>
                    <DiffLabel>Role</DiffLabel>
                    <DiffOldValue>{getRoleLabel(selectedAccount.role)}</DiffOldValue>
                    <DiffArrow>&rarr;</DiffArrow>
                    <DiffNewValue>{getRoleLabel(pending.role)}</DiffNewValue>
                  </DiffRow>
                )}
                {pending.creditData && pending.creditData.freeCredit !== selectedAccount.freeCredit && (
                  <DiffRow>
                    <DiffLabel>무료 크레딧</DiffLabel>
                    <DiffOldValue>
                      {selectedAccount.freeCredit.toLocaleString()}
                    </DiffOldValue>
                    <DiffArrow>&rarr;</DiffArrow>
                    <DiffNewValue>
                      {(pending.creditData.freeCredit ?? 0).toLocaleString()}
                    </DiffNewValue>
                  </DiffRow>
                )}
                {pending.creditData && pending.creditData.paidCredit !== selectedAccount.paidCredit && (
                  <DiffRow>
                    <DiffLabel>유료 크레딧</DiffLabel>
                    <DiffOldValue>
                      {selectedAccount.paidCredit.toLocaleString()}
                    </DiffOldValue>
                    <DiffArrow>&rarr;</DiffArrow>
                    <DiffNewValue>
                      {(pending.creditData.paidCredit ?? 0).toLocaleString()}
                    </DiffNewValue>
                  </DiffRow>
                )}
              </DiffTable>
              {pending.role === 'ADMIN' && (
                <WarningText>
                  이 사용자에게 관리자 권한이 부여됩니다.
                </WarningText>
              )}
            </ConfirmBody>
            <ConfirmFooter>
              <Button
                type="button"
                variant="outlined"
                size="medium"
                onClick={handleCancel}
              >
                취소
              </Button>
              <Button
                type="button"
                variant="filled"
                size="medium"
                onClick={handleConfirm}
                disabled={combinedMutation.isPending}
              >
                {combinedMutation.isPending ? '수정 중...' : '수정 확인'}
              </Button>
            </ConfirmFooter>
          </ConfirmContent>
        </ConfirmOverlay>
      )}
    </>
  );
}
