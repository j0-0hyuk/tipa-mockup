import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '@emotion/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import { Flex, Spinner } from '@docs-front/ui';
import { useTossPayments } from '@/hooks/useTossPayments';
import { postTossOrder, postTossPaymentConfirm } from '@/api/tossPayments';
import { getReferralValidate } from '@/api/referral';
import { getAccountMeQueryOptions } from '@/query/options/account';
import type { ProductWithDisplayPrice } from '@/hooks/useProductPrices';
import {
  StyledTossPaymentModalOverlay,
  StyledTossPaymentModalContent,
  StyledTossPaymentModalTitle,
  StyledTossPaymentModalDescription,
  StyledTossPaymentModalCloseButton,
  StyledPaymentMethodsWrapper,
  StyledAgreementWrapper,
  StyledOrderSummary,
  StyledOrderSummaryRow,
  StyledOrderLabel,
  StyledOrderValue,
  StyledPaymentButton,
  StyledErrorMessage,
  StyledOriginalPrice,
  StyledDiscountBadge,
  StyledDiscountRow,
  StyledDiscountLabel,
  StyledDiscountValue,
  StyledReferralInfo,
  StyledDiscountResolutionBanner
} from './TossPaymentModal.style';
import { formatPrice } from '@/hooks/useProductPrices';

interface TossPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductWithDisplayPrice;
  couponCode?: string; // 쿠폰 코드 (선택)
}

export const TossPaymentModal = ({
  open,
  onOpenChange,
  product,
  couponCode
}: TossPaymentModalProps) => {
  const theme = useTheme();
  const isInitializedRef = useRef(false);
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referralApplied, setReferralApplied] = useState(false);
  const [referrerName, setReferrerName] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<{
    orderId: string;
    orderName: string;
    amount: number;
    originalAmount?: number;
    discountAmount?: number;
    requiresPayment: boolean;
    appliedDiscountType?: 'COUPON' | 'REFERRAL' | 'NONE';
  } | null>(null);

  const { data: account } = useQuery(getAccountMeQueryOptions());

  const {
    widgets,
    isReady,
    setAmount,
    renderPaymentMethods,
    renderAgreement,
    requestPayment,
    resetWidgets
  } = useTossPayments();

  // 주문 생성 mutation (모달 열릴 때 호출)
  const orderMutation = useMutation({
    mutationFn: postTossOrder,
    onSuccess: async (response) => {
      if (response.error) {
        setError(response.error.message || '주문 생성에 실패했습니다.');
        return;
      }

      const requiresPayment = response.data.requiresPayment ?? true;

      setOrderData({
        orderId: response.data.orderId,
        orderName: response.data.orderName,
        amount: response.data.amount,
        originalAmount: response.data.originalAmount,
        discountAmount: response.data.discountAmount,
        requiresPayment,
        appliedDiscountType: response.data.appliedDiscountType
      });
    },
    onError: (err: Error) => {
      console.error('Order creation failed:', err);
      setError(err.message || '주문 생성에 실패했습니다. 다시 시도해주세요.');
    }
  });

  // 모달 열릴 때 주문 생성 (referralCode 검증 후 포함)
  useEffect(() => {
    if (!open || orderMutation.isPending || orderData) return;

    const createOrder = async () => {
      let validReferralCode: string | undefined;
      const storedRef = localStorage.getItem('referralCode');

      if (storedRef) {
        try {
          // 인증 기반 호출 - SELF_REFERRAL 등 서버 측 검증 수행
          const result = await getReferralValidate(storedRef);
          if (result.valid) {
            validReferralCode = storedRef;
            setReferralApplied(true);
            if (result.referrerDisplayName) {
              setReferrerName(result.referrerDisplayName);
            }
          } else {
            localStorage.removeItem('referralCode');
          }
        } catch (error) {
          // 네트워크/서버 일시 오류: referralCode 보존, 결제는 코드 없이 진행
          console.error('Referral validation failed:', error);
        }
      }

      orderMutation.mutate({
        itemType: product.itemType,
        amount: product.krw,
        couponCode: couponCode?.trim() || undefined,
        referralCode: validReferralCode,
        currency: 'KRW'
      });
    };

    createOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product.itemType, product.krw, couponCode]);

  // 무료 결제 처리
  // - 토스페이먼츠 정책상 카드 결제는 100원 미만 불가
  // - 쿠폰/할인으로 0원 또는 100원 미만이 되면 백엔드가 requiresPayment=false로 내려줌
  const freePaymentMutation = useMutation({
    mutationFn: postTossPaymentConfirm,
    onSuccess: (response) => {
      // 에러가 없거나 success가 true면 성공 처리
      if (!response.error && response.data.success !== false) {
        // 결제 성공 - 성공 페이지로 이동 (무료 결제는 paymentKey=FREE)
        window.location.href = `${window.location.origin}/payment/success?paymentKey=FREE&orderId=${orderData?.orderId}&amount=${orderData?.amount}`;
      } else {
        setError(
          response.data.error?.message ||
            response.error?.message ||
            '결제 처리에 실패했습니다.'
        );
      }
    },
    onError: (err: Error) => {
      console.error('Free payment confirm failed:', err);
      setError(err.message || '결제 처리에 실패했습니다. 다시 시도해주세요.');
    }
  });

  // 위젯 렌더링 (주문 생성 완료 후, requiresPayment = true인 경우만)
  useEffect(() => {
    if (!open || !orderData) return;

    // 결제 금액이 0원/100원 미만이라 결제창 없이 바로 confirm 호출
    if (!orderData.requiresPayment) {
      setIsWidgetReady(true); // 버튼 활성화를 위해
      return;
    }

    // 이미 초기화되었거나 위젯 준비 안됨
    if (!isReady || !widgets || isInitializedRef.current) return;

    const initializeWidgets = async () => {
      try {
        setError(null);

        // 할인 적용된 금액으로 설정
        await setAmount({ currency: 'KRW', value: orderData.amount });

        // 결제 수단 UI 렌더링
        await renderPaymentMethods({
          selector: '#toss-payment-methods',
          variantKey: 'DEFAULT'
        });

        // 약관 UI 렌더링
        await renderAgreement({
          selector: '#toss-agreement'
        });

        isInitializedRef.current = true;
        setIsWidgetReady(true);
      } catch (err) {
        console.error('Failed to initialize widgets:', err);
        setError('결제 위젯을 불러오는데 실패했습니다. 페이지를 새로고침해주세요.');
      }
    };

    // DOM이 렌더링된 후 위젯 초기화
    const timer = setTimeout(initializeWidgets, 200);
    return () => clearTimeout(timer);
  }, [open, isReady, widgets, orderData, setAmount, renderPaymentMethods, renderAgreement]);

  // 모달 닫을 때 상태 초기화
  useEffect(() => {
    if (!open) {
      isInitializedRef.current = false;
      setIsWidgetReady(false);
      setError(null);
      setOrderData(null);
      setReferralApplied(false);
      setReferrerName(null);
      // 토스페이먼츠 위젯 인스턴스 리셋 (다음에 다시 생성되도록)
      resetWidgets();
    }
  }, [open, resetWidgets]);

  const handlePayment = async () => {
    if (!isWidgetReady || !orderData) return;

    setError(null);

    // 결제 금액이 0원/100원 미만이라 결제창 없이 바로 confirm 호출
    if (!orderData.requiresPayment) {
      freePaymentMutation.mutate({
        paymentKey: '', // 빈 문자열
        orderId: orderData.orderId,
        amount: orderData.amount
      });
      return;
    }

    try {
      // 일반 결제: 토스 결제창 띄우기
      await requestPayment({
        orderId: orderData.orderId,
        orderName: orderData.orderName,
        customerEmail: account?.email,
        customerName: account?.name || undefined
      });
    } catch (err) {
      console.error('Payment request failed:', err);
      const message =
        err instanceof Error
          ? err.message
          : '결제 요청에 실패했습니다. 다시 시도해주세요.';
      setError(message);
    }
  };

  // 할인 여부 확인 (Boolean으로 변환하여 0이 렌더링되는 것을 방지)
  const hasDiscount = Boolean(orderData?.discountAmount && orderData.discountAmount > 0);
  // 표시할 금액 (주문 생성 전에는 상품 가격, 후에는 할인 적용 금액)
  const displayAmount = orderData?.amount ?? product.krw;
  const displayPrice = formatPrice(displayAmount, 'KRW');

  // 레퍼럴/쿠폰 충돌 감지
  const hasBothCodes = referralApplied && Boolean(couponCode?.trim());
  const appliedType = orderData?.appliedDiscountType;

  // 할인 배지 텍스트
  const discountBadgeText = (() => {
    if (!appliedType || appliedType === 'NONE') return '할인 적용';
    if (appliedType === 'REFERRAL') return '초대 할인';
    if (appliedType === 'COUPON') return '쿠폰 할인';
    return '할인 적용';
  })();

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <StyledTossPaymentModalOverlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </StyledTossPaymentModalOverlay>

            <StyledTossPaymentModalContent asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <StyledTossPaymentModalCloseButton>
                  <X size={24} color={theme.color.textGray} />
                </StyledTossPaymentModalCloseButton>

                <StyledTossPaymentModalTitle>
                  결제하기
                </StyledTossPaymentModalTitle>

                <StyledTossPaymentModalDescription>
                  독스헌트 {product?.name}을 구매합니다
                </StyledTossPaymentModalDescription>

                {/* 추천인 정보 */}
                {referralApplied && (
                  <StyledReferralInfo>
                    {referrerName
                      ? `${referrerName}님의 추천으로 결제합니다`
                      : '추천 코드가 적용되었습니다'}
                  </StyledReferralInfo>
                )}

                {/* 주문 요약 */}
                <StyledOrderSummary>
                  <StyledOrderSummaryRow>
                    <StyledOrderLabel>상품</StyledOrderLabel>
                    <StyledOrderValue>{orderData?.orderName ?? product?.name}</StyledOrderValue>
                  </StyledOrderSummaryRow>
                  {hasDiscount && orderData?.originalAmount && (
                    <>
                      <StyledOrderSummaryRow>
                        <StyledOrderLabel>정가</StyledOrderLabel>
                        <StyledOrderValue>
                          <StyledOriginalPrice>
                            {formatPrice(orderData.originalAmount, 'KRW')}
                          </StyledOriginalPrice>
                        </StyledOrderValue>
                      </StyledOrderSummaryRow>
                      <StyledDiscountRow>
                        <StyledDiscountLabel>할인</StyledDiscountLabel>
                        <StyledDiscountValue>
                          -{formatPrice(orderData.discountAmount!, 'KRW')}
                        </StyledDiscountValue>
                      </StyledDiscountRow>
                    </>
                  )}
                  {hasBothCodes && hasDiscount && appliedType && appliedType !== 'NONE' && (
                    <StyledDiscountResolutionBanner>
                      {appliedType === 'REFERRAL'
                        ? '초대 할인(10%)이 적용됩니다. 중복 할인은 적용되지 않습니다.'
                        : '쿠폰 할인이 적용됩니다. 중복 할인은 적용되지 않습니다.'}
                    </StyledDiscountResolutionBanner>
                  )}
                  <StyledOrderSummaryRow>
                    <StyledOrderLabel>결제 금액</StyledOrderLabel>
                    <StyledOrderValue $highlight>
                      {displayPrice}
                      {hasDiscount && (
                        <StyledDiscountBadge>{discountBadgeText}</StyledDiscountBadge>
                      )}
                    </StyledOrderValue>
                  </StyledOrderSummaryRow>
                </StyledOrderSummary>

                {/* 결제 수단 선택 (requiresPayment = true인 경우만) */}
                {orderData?.requiresPayment !== false && (
                  <StyledPaymentMethodsWrapper>
                    {!isWidgetReady && (
                      <Flex
                        height="300px"
                        justify="center"
                        alignItems="center"
                        direction="column"
                        gap={12}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
                      >
                        <Spinner size={32} />
                        <p style={{ color: theme.color.textGray, fontSize: 14 }}>
                          결제 수단을 불러오는 중...
                        </p>
                      </Flex>
                    )}
                    <div
                      id="toss-payment-methods"
                    />
                  </StyledPaymentMethodsWrapper>
                )}

                {/* 약관 동의 (requiresPayment = true인 경우만) */}
                {orderData?.requiresPayment !== false && (
                  <StyledAgreementWrapper>
                    <div
                      id="toss-agreement"
                    />
                  </StyledAgreementWrapper>
                )}

                {/* 무료 결제 안내 (requiresPayment = false인 경우) */}
                {orderData?.requiresPayment === false && (
                  <div
                    style={{
                      padding: '24px',
                      backgroundColor: theme.color.bgGray,
                      borderRadius: '12px',
                      textAlign: 'center',
                      marginBottom: '24px'
                    }}
                  >
                    <p style={{ margin: 0, color: theme.color.textGray, fontSize: 14 }}>
                      할인이 적용되어 결제 금액이 없습니다.
                    </p>
                    <p style={{ margin: '8px 0 0 0', color: theme.color.textGray, fontSize: 14 }}>
                      아래 버튼을 눌러 이용권을 받으세요.
                    </p>
                  </div>
                )}

                {/* 결제 버튼 */}
                <StyledPaymentButton
                  onClick={handlePayment}
                  $disabled={!isWidgetReady || orderMutation.isPending || freePaymentMutation.isPending || !orderData}
                >
                  {orderMutation.isPending ? (
                    <Flex justify="center" alignItems="center" gap={8}>
                      <Spinner size={20} />
                      주문 생성 중...
                    </Flex>
                  ) : freePaymentMutation.isPending ? (
                    <Flex justify="center" alignItems="center" gap={8}>
                      <Spinner size={20} />
                      처리 중...
                    </Flex>
                  ) : orderData?.requiresPayment === false ? (
                    '무료로 이용권 받기'
                  ) : (
                    `${displayPrice} 결제하기`
                  )}
                </StyledPaymentButton>

                {error && <StyledErrorMessage>{error}</StyledErrorMessage>}
              </motion.div>
            </StyledTossPaymentModalContent>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};
