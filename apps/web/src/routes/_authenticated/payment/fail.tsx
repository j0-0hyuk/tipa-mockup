import { createFileRoute, useNavigate } from '@tanstack/react-router';
import styled from '@emotion/styled';
import { Flex, Button } from '@docs-front/ui';

interface PaymentFailSearch {
  code: string;
  message: string;
  orderId?: string;
}

export const Route = createFileRoute('/_authenticated/payment/fail')({
  component: PaymentFailComponent,
  validateSearch: (search: Record<string, unknown>): PaymentFailSearch => ({
    code: String(search.code || 'UNKNOWN_ERROR'),
    message: String(search.message || '알 수 없는 오류가 발생했습니다.'),
    orderId: search.orderId ? String(search.orderId) : undefined
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

const StatusIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.color.error};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.p`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.black};
`;

const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.color.textGray};
  max-width: 400px;
  text-align: center;
  line-height: 1.5;
`;

const MetaInfo = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.color.textGray};
`;

const SupportLink = styled.button`
  color: ${({ theme }) => theme.color.main};
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
`;

const FooterText = styled.p`
  margin-top: 24px;
  font-size: 13px;
  color: ${({ theme }) => theme.color.textGray};
`;

function PaymentFailComponent() {
  const navigate = useNavigate();
  const { code, message, orderId } = Route.useSearch();

  const getErrorTitle = () => {
    switch (code) {
      case 'PAY_PROCESS_CANCELED':
        return '결제가 취소되었습니다';
      case 'PAY_PROCESS_ABORTED':
        return '결제가 중단되었습니다';
      case 'REJECT_CARD_COMPANY':
        return '카드사에서 결제를 거절했습니다';
      case 'INVALID_CARD_NUMBER':
        return '유효하지 않은 카드 번호입니다';
      case 'EXCEED_MAX_DAILY_PAYMENT_COUNT':
        return '일일 결제 한도를 초과했습니다';
      case 'EXCEED_MAX_PAYMENT_AMOUNT':
        return '결제 금액 한도를 초과했습니다';
      default:
        return '결제에 실패했습니다';
    }
  };

  const getErrorDescription = () => {
    switch (code) {
      case 'PAY_PROCESS_CANCELED':
        return '결제 과정에서 취소하셨습니다. 다시 시도해주세요.';
      case 'PAY_PROCESS_ABORTED':
        return '결제 진행 중 문제가 발생했습니다. 다시 시도해주세요.';
      case 'REJECT_CARD_COMPANY':
        return '카드 정보를 확인하거나 다른 결제 수단을 이용해주세요.';
      default:
        return message || '잠시 후 다시 시도해주세요.';
    }
  };

  return (
    <PageContainer>
      <StatusIcon>
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

      <Title>{getErrorTitle()}</Title>

      <Description>{getErrorDescription()}</Description>

      {orderId && <MetaInfo>주문번호: {orderId}</MetaInfo>}

      <MetaInfo>오류 코드: {code}</MetaInfo>

      <Flex gap={12} style={{ marginTop: '16px' }}>
        <Button
          onClick={() =>
            navigate({ to: '/credit-plan', search: { pricing: true } })
          }
          $bgColor="main"
          $color="white"
          padding="12px 24px"
          $typo="Sb_16"
        >
          다시 시도하기
        </Button>

        <Button
          onClick={() => navigate({ to: '/credit-plan' })}
          $bgColor="white"
          $color="black"
          $borderColor="borderGray"
          padding="12px 24px"
          $typo="Sb_16"
        >
          내 플랜으로 돌아가기
        </Button>
      </Flex>

      <FooterText>
        문제가 지속되면{' '}
        <SupportLink onClick={() => window.ChannelIO?.('showMessenger')}>
          고객센터
        </SupportLink>
        로 문의해주세요.
      </FooterText>
    </PageContainer>
  );
}
