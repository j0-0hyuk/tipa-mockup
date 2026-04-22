import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Flex, Skeleton, useToast } from '@bichon/ds';
import {
  SectionCard,
  SectionHeader,
  SectionTitle,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  EmptyState,
  CancelStatusBadge,
  RefundButton,
  ConfirmOverlay,
  ConfirmContent,
  ConfirmHeader,
  ConfirmTitle,
  ConfirmBody,
  ConfirmFooter,
  FormField,
  Label,
  Input,
  TextArea,
  RadioGroup,
  RadioLabel,
  DangerButton,
  CancelButton,
  PaymentSummary,
  PaymentSummaryRow,
  PaymentSummaryLabel,
  PaymentSummaryValue,
  DiffTable,
  DiffRow,
  DiffLabel,
  DiffNewValue,
  WarningText,
  ErrorMessage,
  PaddleNote
} from '@/routes/_authenticated/users/users.style';
import { getAccountSubscriptionUsage } from '@/api/authenticated/accounts';
import { cancelPayment } from '@/api/authenticated/payments';
import type { paymentHistorySchema } from '@/schema/api/accounts/subscription';

interface PaymentHistoryTabProps {
  accountId: number;
}

type PaymentHistory = z.infer<typeof paymentHistorySchema>;

const EVENT_TYPE_LABELS: Record<string, string> = {
  SUBSCRIPTION_PURCHASED: '구독 결제',
  MONTHLY_PASS_PURCHASED: '월간 패스 구매',
  SEASON_PASS_PURCHASED: '시즌 패스 구매'
};

const ITEM_TYPE_LABELS: Record<string, string> = {
  SUBSCRIPTION_M: '월간 구독',
  SUBSCRIPTION_Y: '연간 구독',
  MONTHLY_PASS: '월간 패스',
  SEASON_PASS: '시즌 패스'
};

const CANCEL_STATUS_LABELS: Record<string, string> = {
  FULL: '전액 환불',
  PARTIAL: '부분 환불'
};

const formatPrice = (price: number | null, currency: string | null) => {
  if (price == null) return '-';
  if (currency === 'USD') return `$${price.toFixed(2)}`;
  if (currency === 'KRW') return `₩${price.toLocaleString()}`;
  return price.toLocaleString();
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

const cancelFormSchema = z
  .object({
    cancelType: z.enum(['FULL', 'PARTIAL']),
    cancelAmount: z.string().optional(),
    cancelReason: z.string().min(1, '취소 사유를 입력해주세요.').max(200)
  })
  .refine(
    (data) => {
      if (data.cancelType === 'PARTIAL') {
        const amount = Number(data.cancelAmount);
        return !isNaN(amount) && amount > 0;
      }
      return true;
    },
    { message: '환불 금액을 올바르게 입력해주세요.', path: ['cancelAmount'] }
  );

type CancelFormValues = z.infer<typeof cancelFormSchema>;

function canRefund(payment: PaymentHistory): boolean {
  return (
    payment.paymentProvider === 'TOSS' &&
    payment.paymentKey != null &&
    payment.paymentKey !== '' &&
    payment.cancelStatus !== 'FULL' &&
    getRefundableAmount(payment) > 0
  );
}

function getRefundableAmount(payment: PaymentHistory): number {
  const total = payment.totalPrice ?? 0;
  const cancelled = payment.cancelledAmount ?? 0;
  return Math.max(0, total - cancelled);
}

export function PaymentHistoryTab({ accountId }: PaymentHistoryTabProps) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [cancelTarget, setCancelTarget] = useState<PaymentHistory | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingData, setPendingData] = useState<{
    paymentHistoryId: number;
    paymentKey: string;
    cancelReason: string;
    cancelAmount?: number;
  } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['account-subscription', accountId],
    queryFn: () => getAccountSubscriptionUsage(accountId)
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<CancelFormValues>({
    resolver: zodResolver(cancelFormSchema),
    defaultValues: {
      cancelType: 'FULL',
      cancelAmount: '',
      cancelReason: ''
    }
  });

  const cancelType = watch('cancelType');

  const cancelMutation = useMutation({
    mutationFn: cancelPayment,
    onSuccess: () => {
      toast.showToast('결제가 성공적으로 취소되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['account-subscription', accountId]
      });
      handleCloseAll();
    },
    onError: (error: Error) => {
      toast.showToast(`결제 취소 실패: ${error.message}`);
    }
  });

  const handleOpenCancelModal = (payment: PaymentHistory) => {
    setCancelTarget(payment);
    reset({
      cancelType: 'FULL',
      cancelAmount: '',
      cancelReason: ''
    });
  };

  const handleCancelFormSubmit = (values: CancelFormValues) => {
    if (!cancelTarget?.paymentKey) return;

    const refundableAmount = getRefundableAmount(cancelTarget);
    const cancelAmount =
      values.cancelType === 'PARTIAL'
        ? Number(values.cancelAmount)
        : refundableAmount;

    if (values.cancelType === 'PARTIAL' && cancelAmount > refundableAmount) {
      toast.showToast(`환불 가능 금액(${formatPrice(refundableAmount, cancelTarget.currency)})을 초과할 수 없습니다.`);
      return;
    }

    setPendingData({
      paymentHistoryId: cancelTarget.paymentHistoryId,
      paymentKey: cancelTarget.paymentKey,
      cancelReason: values.cancelReason,
      ...(values.cancelType === 'PARTIAL' ? { cancelAmount } : {})
    });
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (!pendingData) return;
    cancelMutation.mutate(pendingData);
  };

  const handleCloseAll = () => {
    setCancelTarget(null);
    setShowConfirm(false);
    setPendingData(null);
    reset();
  };

  if (isLoading) {
    return (
      <SectionCard>
        <SectionHeader>
          <SectionTitle>결제 이력</SectionTitle>
        </SectionHeader>
        <Flex direction="column" gap={8}>
          <Skeleton loading width="100%" height={36} />
          <Skeleton loading width="100%" height={32} />
          <Skeleton loading width="100%" height={32} />
          <Skeleton loading width="100%" height={32} />
        </Flex>
      </SectionCard>
    );
  }

  if (!data) {
    return (
      <SectionCard>
        <EmptyState>결제 이력을 불러올 수 없습니다.</EmptyState>
      </SectionCard>
    );
  }

  const { paymentHistories } = data;

  return (
    <>
      <SectionCard>
        <SectionHeader>
          <SectionTitle>결제 이력</SectionTitle>
        </SectionHeader>

        {paymentHistories.length === 0 ? (
          <EmptyState style={{ padding: '16px' }}>
            결제 이력이 없습니다.
          </EmptyState>
        ) : (
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>이벤트</TableHeaderCell>
                <TableHeaderCell>상품</TableHeaderCell>
                <TableHeaderCell>금액</TableHeaderCell>
                <TableHeaderCell>상태</TableHeaderCell>
                <TableHeaderCell>결제일</TableHeaderCell>
                <TableHeaderCell>생성일</TableHeaderCell>
                <TableHeaderCell>액션</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {paymentHistories.map((payment) => (
                <TableRow key={payment.paymentHistoryId}>
                  <TableCell>
                    {EVENT_TYPE_LABELS[payment.eventType] ?? payment.eventType}
                  </TableCell>
                  <TableCell>
                    {ITEM_TYPE_LABELS[payment.itemType] ?? payment.itemType}
                  </TableCell>
                  <TableCell>
                    {formatPrice(payment.totalPrice, payment.currency)}
                  </TableCell>
                  <TableCell>
                    {payment.cancelStatus ? (
                      <CancelStatusBadge $status={payment.cancelStatus}>
                        {CANCEL_STATUS_LABELS[payment.cancelStatus]}
                      </CancelStatusBadge>
                    ) : (
                      <CancelStatusBadge $status={null}>
                        결제 완료
                      </CancelStatusBadge>
                    )}
                  </TableCell>
                  <TableCell>{formatDateTime(payment.paidAt)}</TableCell>
                  <TableCell>{formatDateTime(payment.createdAt)}</TableCell>
                  <TableCell>
                    {canRefund(payment) ? (
                      <RefundButton
                        onClick={() => handleOpenCancelModal(payment)}
                      >
                        {payment.cancelStatus === 'PARTIAL'
                          ? '추가 환불'
                          : '환불'}
                      </RefundButton>
                    ) : payment.paymentProvider === 'PADDLE' ? (
                      <PaddleNote>Paddle 수동 처리</PaddleNote>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>

      {/* 환불 폼 모달 */}
      {cancelTarget && !showConfirm && (
        <ConfirmOverlay onClick={handleCloseAll}>
          <ConfirmContent onClick={(e) => e.stopPropagation()}>
            <ConfirmHeader>
              <ConfirmTitle>결제 취소</ConfirmTitle>
            </ConfirmHeader>
            <ConfirmBody>
              <Flex direction="column" gap={16}>
                <PaymentSummary>
                  <PaymentSummaryRow>
                    <PaymentSummaryLabel>상품</PaymentSummaryLabel>
                    <PaymentSummaryValue>
                      {ITEM_TYPE_LABELS[cancelTarget.itemType] ??
                        cancelTarget.itemType}
                    </PaymentSummaryValue>
                  </PaymentSummaryRow>
                  <PaymentSummaryRow>
                    <PaymentSummaryLabel>결제 금액</PaymentSummaryLabel>
                    <PaymentSummaryValue>
                      {formatPrice(
                        cancelTarget.totalPrice,
                        cancelTarget.currency
                      )}
                    </PaymentSummaryValue>
                  </PaymentSummaryRow>
                  {cancelTarget.cancelledAmount != null &&
                    cancelTarget.cancelledAmount > 0 && (
                      <PaymentSummaryRow>
                        <PaymentSummaryLabel>기 환불 금액</PaymentSummaryLabel>
                        <PaymentSummaryValue>
                          {formatPrice(
                            cancelTarget.cancelledAmount,
                            cancelTarget.currency
                          )}
                        </PaymentSummaryValue>
                      </PaymentSummaryRow>
                    )}
                  <PaymentSummaryRow>
                    <PaymentSummaryLabel>환불 가능 금액</PaymentSummaryLabel>
                    <PaymentSummaryValue>
                      {formatPrice(
                        getRefundableAmount(cancelTarget),
                        cancelTarget.currency
                      )}
                    </PaymentSummaryValue>
                  </PaymentSummaryRow>
                  <PaymentSummaryRow>
                    <PaymentSummaryLabel>결제일</PaymentSummaryLabel>
                    <PaymentSummaryValue>
                      {formatDateTime(cancelTarget.paidAt)}
                    </PaymentSummaryValue>
                  </PaymentSummaryRow>
                </PaymentSummary>

                <form
                  id="cancel-form"
                  onSubmit={handleSubmit(handleCancelFormSubmit)}
                >
                  <Flex direction="column" gap={16}>
                    <FormField>
                      <Label>환불 유형</Label>
                      <RadioGroup>
                        <RadioLabel $checked={cancelType === 'FULL'}>
                          <input
                            type="radio"
                            value="FULL"
                            {...register('cancelType')}
                          />
                          전체 환불
                        </RadioLabel>
                        <RadioLabel $checked={cancelType === 'PARTIAL'}>
                          <input
                            type="radio"
                            value="PARTIAL"
                            {...register('cancelType')}
                          />
                          부분 환불
                        </RadioLabel>
                      </RadioGroup>
                    </FormField>

                    {cancelType === 'PARTIAL' && (
                      <FormField>
                        <Label>환불 금액</Label>
                        <Input
                          type="number"
                          placeholder={`최대 ${getRefundableAmount(cancelTarget)}`}
                          min={1}
                          max={getRefundableAmount(cancelTarget)}
                          {...register('cancelAmount')}
                        />
                        {errors.cancelAmount && (
                          <ErrorMessage>
                            {errors.cancelAmount.message}
                          </ErrorMessage>
                        )}
                      </FormField>
                    )}

                    <FormField>
                      <Label>취소 사유</Label>
                      <TextArea
                        placeholder="환불 사유를 입력해주세요."
                        {...register('cancelReason')}
                      />
                      {errors.cancelReason && (
                        <ErrorMessage>
                          {errors.cancelReason.message}
                        </ErrorMessage>
                      )}
                    </FormField>
                  </Flex>
                </form>
              </Flex>
            </ConfirmBody>
            <ConfirmFooter>
              <CancelButton onClick={handleCloseAll}>
                취소
              </CancelButton>
              <DangerButton type="submit" form="cancel-form">
                환불 요청
              </DangerButton>
            </ConfirmFooter>
          </ConfirmContent>
        </ConfirmOverlay>
      )}

      {/* 최종 확인 모달 */}
      {showConfirm && cancelTarget && pendingData && (
        <ConfirmOverlay onClick={handleCloseAll}>
          <ConfirmContent onClick={(e) => e.stopPropagation()}>
            <ConfirmHeader>
              <ConfirmTitle>환불 확인</ConfirmTitle>
            </ConfirmHeader>
            <ConfirmBody>
              <Flex direction="column" gap={12}>
                <DiffTable>
                  <DiffRow>
                    <DiffLabel>상품</DiffLabel>
                    <DiffNewValue>
                      {ITEM_TYPE_LABELS[cancelTarget.itemType] ??
                        cancelTarget.itemType}
                    </DiffNewValue>
                  </DiffRow>
                  <DiffRow>
                    <DiffLabel>환불 유형</DiffLabel>
                    <DiffNewValue>
                      {pendingData.cancelAmount != null
                        ? '부분 환불'
                        : '전체 환불'}
                    </DiffNewValue>
                  </DiffRow>
                  <DiffRow>
                    <DiffLabel>환불 금액</DiffLabel>
                    <DiffNewValue>
                      {formatPrice(
                        pendingData.cancelAmount ??
                          getRefundableAmount(cancelTarget),
                        cancelTarget.currency
                      )}
                    </DiffNewValue>
                  </DiffRow>
                  <DiffRow>
                    <DiffLabel>취소 사유</DiffLabel>
                    <DiffNewValue>{pendingData.cancelReason}</DiffNewValue>
                  </DiffRow>
                </DiffTable>
                <WarningText>
                  결제 취소는 되돌릴 수 없습니다. 토스페이먼츠를 통해 환불이
                  진행됩니다.
                  {pendingData.cancelAmount == null &&
                    ' 전액 환불 시 해당 사용자는 FREE 유저로 자동 전환됩니다.'}
                </WarningText>
              </Flex>
            </ConfirmBody>
            <ConfirmFooter>
              <CancelButton onClick={() => setShowConfirm(false)}>
                뒤로
              </CancelButton>
              <DangerButton
                onClick={handleConfirm}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? '처리 중...' : '환불 확인'}
              </DangerButton>
            </ConfirmFooter>
          </ConfirmContent>
        </ConfirmOverlay>
      )}
    </>
  );
}
