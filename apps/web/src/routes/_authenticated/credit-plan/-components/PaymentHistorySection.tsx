import { FileText } from 'lucide-react';
import { getReceipt } from '@/api/payments';
import { ItemType } from '@/schema/api/payments/payments.ts';
import {
  StyledSection,
  StyledSectionTitle,
  StyledPaymentTable,
  StyledTableHeader,
  StyledTableRow,
  StyledTableCell,
  StyledReceiptButton,
  StyledSubscriptionButton
} from '@/routes/_authenticated/credit-plan/-components/CreditPlan.style';
import { useI18n } from '@/hooks/useI18n.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchCancelSubscription } from '@/api/subscription';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { useAuth } from '@/service/auth/hook';
import { openTallyPopup } from '@/components/Tally';

interface PaymentHistoryItem {
  id: number;
  eventType: string;
  itemType: string;
  totalPrice: number;
  currency: string;
  payedAt?: string;
  nextPaidAt?: string;
  createdAt: string;
}

interface PaymentHistorySectionProps {
  paymentHistory: PaymentHistoryItem[];
  isLoading: boolean;
  error: Error | null;
  subscription: {
    item: string;
    endsAt: string | undefined;
    changeToAtEnds: string;
  } | null;
}

export const PaymentHistorySection = ({
  paymentHistory,
  isLoading,
  error,
  subscription
}: PaymentHistorySectionProps) => {
  const { t } = useI18n(['creditPlan']);
  const { isMobile, sm } = useBreakPoints();
  const getPaymentItemName = (itemType: string) => {
    switch (itemType) {
      case ItemType.SUBSCRIPTION_M:
        return t('creditPlan:paymentItems.SUBSCRIPTION_M');
      case ItemType.SUBSCRIPTION_Y:
        return t('creditPlan:paymentItems.SUBSCRIPTION_Y');
      case ItemType.SEASON_PASS:
        return t('creditPlan:paymentItems.SEASON_PASS');
      case ItemType.MONTHLY_PASS:
        return t('creditPlan:paymentItems.MONTHLY_PASS');
      default:
        return itemType;
    }
  };

  const handleReceiptClick = async (paymentHistoryId: number) => {
    try {
      const receiptData = await getReceipt(paymentHistoryId);
      window.open(receiptData.data.receiptUrl, '_blank');
    } catch {
      alert(t('creditPlan:errors.receiptError'));
    }
  };

  const queryClient = useQueryClient();
  const { refresh } = useAuth();
  const isActiveSubscription = !!subscription;
  const showCancelButton =
    isActiveSubscription && subscription?.changeToAtEnds !== 'CANCELED';

  const cancelSubscriptionMutation = useMutation({
    mutationFn: patchCancelSubscription,
    onSuccess: async () => {
      await refresh();
      await queryClient.invalidateQueries({ queryKey: ['subscription'] });
      alert(t('creditPlan:cancelSuccess'));

      openTallyPopup('RGdQLQ', {
        layout: 'modal',
        hideTitle: true,
        width: 700,
        autoClose: 5000
      });
    }
  });

  const handleCancelSubscription = () => {
    if (confirm(t('creditPlan:cancelConfirm'))) {
      cancelSubscriptionMutation.mutate();
    }
  };

  return (
    <StyledSection $isMobile={isMobile}>
      <StyledSectionTitle>{t('creditPlan:paymentHistory')}</StyledSectionTitle>

      <StyledPaymentTable>
        <StyledTableHeader>
          <StyledTableCell $isSm={sm} style={{ flex: 1 }}>
            {t('creditPlan:paymentTable.date')}
          </StyledTableCell>
          <StyledTableCell $isSm={sm} style={{ flex: 1 }}>
            {t('creditPlan:paymentTable.paymentContent')}
          </StyledTableCell>
          <StyledTableCell $isSm={sm} style={{ width: sm ? '64px' : '170px' }}>
            {t('creditPlan:paymentTable.receipt')}
          </StyledTableCell>
          <StyledTableCell
            $isSm={sm}
            style={{ width: sm ? '76px' : '100px', textAlign: 'right' }}
          >
            {t('creditPlan:paymentTable.totalAmount')}
          </StyledTableCell>
        </StyledTableHeader>

        {isLoading ? (
          <StyledTableRow>
            <StyledTableCell
              $isSm={sm}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: sm ? '20px' : '40px',
                gridColumn: '1 / -1'
              }}
            >
              {t('creditPlan:loading')}
            </StyledTableCell>
          </StyledTableRow>
        ) : error ? (
          <StyledTableRow>
            <StyledTableCell
              $isSm={sm}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: sm ? '20px' : '40px',
                gridColumn: '1 / -1'
              }}
            >
              {t('creditPlan:errors.paymentHistoryError')}
            </StyledTableCell>
          </StyledTableRow>
        ) : paymentHistory.length > 0 ? (
          paymentHistory.map((payment) => (
            <StyledTableRow key={payment.id}>
              <StyledTableCell $isSm={sm} style={{ flex: 1 }}>
                {payment.createdAt}
              </StyledTableCell>
              <StyledTableCell $isSm={sm} style={{ flex: 1 }}>
                {getPaymentItemName(payment.itemType)}
              </StyledTableCell>
              <StyledTableCell
                $isSm={sm}
                style={{ width: sm ? '44px' : '170px' }}
              >
                <StyledReceiptButton
                  $isSm={sm}
                  onClick={() => handleReceiptClick(payment.id)}
                >
                  <FileText size={sm ? 12 : 16} />
                  {!sm && t('creditPlan:paymentTable.receiptButton')}
                </StyledReceiptButton>
              </StyledTableCell>
              <StyledTableCell
                $isSm={sm}
                style={{ width: sm ? '96px' : '100px', textAlign: 'right' }}
              >
                <div style={{ width: '100%' }}>
                  <div
                    style={{
                      fontSize: sm ? '14px' : '16px',
                      fontWeight: 600,
                      color: '#1a1a1c'
                    }}
                  >
                    {payment.totalPrice.toLocaleString()}
                    {payment.currency === 'KRW' ? '원' : ` ${payment.currency}`}
                  </div>
                  <div
                    style={{ fontSize: sm ? '10px' : '12px', color: '#3f434d' }}
                  >
                    {t('creditPlan:paymentTable.vatIncluded')}
                  </div>
                </div>
              </StyledTableCell>
            </StyledTableRow>
          ))
        ) : (
          <StyledTableRow>
            <StyledTableCell
              $isSm={sm}
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: sm ? '20px' : '40px'
              }}
            >
              {t('creditPlan:paymentTable.noHistory')}
            </StyledTableCell>
          </StyledTableRow>
        )}
      </StyledPaymentTable>

      {showCancelButton && subscription?.item !== 'SEASON_PASS' && subscription?.item !== 'MONTHLY_PASS' && (
        <StyledSubscriptionButton
          $isSm={sm}
          onClick={handleCancelSubscription}
          style={{ alignSelf: 'flex-end' }}
        >
          {t('creditPlan:cancelSubscription')}
        </StyledSubscriptionButton>
      )}
    </StyledSection>
  );
};
