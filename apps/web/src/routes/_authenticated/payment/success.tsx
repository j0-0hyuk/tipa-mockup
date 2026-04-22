import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styled from '@emotion/styled';
import { Spinner } from '@docs-front/ui';
import { postTossPaymentConfirm } from '@/api/tossPayments';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { getPaymentHistoryQueryOptions } from '@/query/options/payments';
import { getSubscriptionQueryOptions } from '@/query/options/subscription';
import { useAuth } from '@/service/auth/hook';
import { trackPurchase } from '@/utils/purchaseTrack';

interface PaymentSuccessSearch {
  paymentKey: string;
  orderId: string;
  amount: string;
  paymentType?: string;
}

export const Route = createFileRoute('/_authenticated/payment/success')({
  component: PaymentSuccessComponent,
  validateSearch: (search: Record<string, unknown>): PaymentSuccessSearch => ({
    paymentKey: String(search.paymentKey || ''),
    orderId: String(search.orderId || ''),
    amount: String(search.amount || '0'),
    paymentType: search.paymentType ? String(search.paymentType) : undefined
  })
});

const PageContainer = styled.main`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  background-color: ${({ theme }) => theme.color.white};
`;

const StatusIcon = styled.div<{ $isError?: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${({ theme, $isError }) =>
    $isError ? theme.color.error : theme.color.main};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.p`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.black};
`;

const Description = styled.p<{ $maxWidth?: string }>`
  font-size: 14px;
  color: ${({ theme }) => theme.color.textGray};
  max-width: ${({ $maxWidth }) => $maxWidth || 'auto'};
  text-align: center;
`;

const ReturnButton = styled.button`
  margin-top: 16px;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.color.main};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

function PaymentSuccessComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { refresh } = useAuth();
  const { paymentKey, orderId, amount } = Route.useSearch();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [errorMessage, setErrorMessage] = useState<string>('');

  const confirmMutation = useMutation({
    mutationFn: postTossPaymentConfirm,
    onSuccess: async (response) => {
      const innerResponse = response.data;

      if (innerResponse.success) {
        setStatus('success');

        // 결제 성공 시 referralCode 제거
        localStorage.removeItem('referralCode');

        // 토큰 갱신 및 쿼리 무효화
        await refresh();
        await queryClient.invalidateQueries(getAccountMeQueryOptions());
        await queryClient.invalidateQueries(getPaymentHistoryQueryOptions());
        await queryClient.invalidateQueries(getSubscriptionQueryOptions());

        // 구매 추적
        if (innerResponse.data) {
          trackPurchase({
            data: {
              items: [],
              totals: { total: innerResponse.data.totalAmount.toString() },
              currency_code: innerResponse.data.currency || 'KRW'
            },
            content_type: 'subscription',
            transaction_id: orderId
          });
        }

        // 3초 후 credit-plan 페이지로 이동
        setTimeout(() => {
          navigate({ to: '/credit-plan', replace: true });
        }, 3000);
      } else {
        setStatus('error');
        setErrorMessage(
          innerResponse.error?.message || '결제 승인에 실패했습니다.'
        );
      }
    },
    onError: (error: Error) => {
      setStatus('error');
      setErrorMessage(error.message || '결제 승인 중 오류가 발생했습니다.');
    }
  });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (!paymentKey || !orderId || !amount) {
      setStatus('error');
      setErrorMessage('결제 정보가 올바르지 않습니다.');
      return;
    }

    // 무료 결제 (paymentKey=FREE): 이미 TossPaymentModal에서 처리 완료
    if (paymentKey === 'FREE') {
      setStatus('success');

      // 결제 성공 시 referralCode 제거
      localStorage.removeItem('referralCode');

      // 토큰 갱신 및 쿼리 무효화
      (async () => {
        await refresh();
        await queryClient.invalidateQueries(getAccountMeQueryOptions());
        await queryClient.invalidateQueries(getPaymentHistoryQueryOptions());
        await queryClient.invalidateQueries(getSubscriptionQueryOptions());
      })();

      // 3초 후 credit-plan 페이지로 이동
      timer = setTimeout(() => {
        navigate({ to: '/credit-plan', replace: true });
      }, 3000);
    } else {
      // 결제 승인 요청
      confirmMutation.mutate({
        paymentKey,
        orderId,
        amount: parseInt(amount, 10)
      });
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentKey, orderId, amount]);

  return (
    <PageContainer>
      {status === 'loading' && (
        <>
          <Spinner size={48} />
          <Title>결제를 처리하고 있습니다...</Title>
          <Description>잠시만 기다려주세요.</Description>
        </>
      )}

      {status === 'success' && (
        <>
          <StatusIcon>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 6L9 17L4 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </StatusIcon>
          <Title>결제가 완료되었습니다!</Title>
          <Description>잠시 후 내 플랜 페이지로 이동합니다...</Description>
        </>
      )}

      {status === 'error' && (
        <>
          <StatusIcon $isError>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </StatusIcon>
          <Title>결제 처리 중 오류가 발생했습니다</Title>
          <Description $maxWidth="400px">{errorMessage}</Description>
          <ReturnButton
            onClick={() => navigate({ to: '/credit-plan', replace: true })}
          >
            내 플랜으로 돌아가기
          </ReturnButton>
        </>
      )}
    </PageContainer>
  );
}
