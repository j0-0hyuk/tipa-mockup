import { useCallback, useEffect, useRef, useState } from 'react';
import {
  loadTossPayments,
  type TossPaymentsWidgets
} from '@tosspayments/tosspayments-sdk';
import { useQuery } from '@tanstack/react-query';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { postTossOrder } from '@/api/tossPayments';
import type { PostTossOrderRequest } from '@/schema/api/payments/toss';

const CLIENT_KEY = import.meta.env.VITE_TOSSPAYMENTS_CLIENT_KEY;

type Currency = 'KRW' | 'USD';

interface Amount {
  currency: Currency;
  value: number;
}

interface RenderPaymentMethodsOptions {
  /** 렌더링할 DOM 요소의 selector */
  selector: string;
  /** 결제위젯 어드민에서 설정한 variantKey */
  variantKey?: string;
}

interface RenderAgreementOptions {
  /** 렌더링할 DOM 요소의 selector */
  selector: string;
  /** 약관 UI variantKey */
  variantKey?: string;
}

interface RequestPaymentParams {
  orderId: string;
  orderName: string;
  customerEmail?: string;
  customerName?: string;
  customerMobilePhone?: string;
  /** 쿠폰 코드 (할인 적용 시) */
  couponCode?: string;
}

export const useTossPayments = () => {
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [amount, setAmountState] = useState<Amount>({ currency: 'KRW', value: 0 });
  const initializingRef = useRef(false);

  // 위젯 리셋 함수 (모달 닫을 때 호출)
  const resetWidgets = useCallback(() => {
    setWidgets(null);
    setIsReady(false);
    initializingRef.current = false;
  }, []);

  const { data: account } = useQuery(getAccountMeQueryOptions());

  // SDK 초기화
  useEffect(() => {
    if (!CLIENT_KEY) {
      console.error('VITE_TOSSPAYMENTS_CLIENT_KEY is not defined');
      return;
    }

    // 이미 위젯이 있으면 스킵 (중복 초기화 방지)
    if (widgets) return;
    if (initializingRef.current) return;

    const initializeWidgets = async () => {
      initializingRef.current = true;

      try {
        const tossPayments = await loadTossPayments(CLIENT_KEY);

        // customerKey 생성 (account.id 기반)
        const customerKey = account?.id
          ? `docshunt_${account.id}`
          : null;

        if (!customerKey) {
          // account가 아직 로드되지 않은 경우
          initializingRef.current = false;
          return;
        }

        const widgetsInstance = tossPayments.widgets({
          customerKey
        });

        setWidgets(widgetsInstance);
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize TossPayments:', error);
        initializingRef.current = false;
      }
    };

    if (account) {
      initializeWidgets();
    }
  }, [account, widgets]);

  // 결제 금액 설정
  const setAmount = useCallback(
    async (newAmount: Amount) => {
      if (!widgets) {
        console.error('Widgets not initialized');
        return;
      }

      try {
        await widgets.setAmount(newAmount);
        setAmountState(newAmount);
      } catch (error) {
        console.error('Failed to set amount:', error);
        throw error;
      }
    },
    [widgets]
  );

  // 결제 UI 렌더링
  const renderPaymentMethods = useCallback(
    async (options: RenderPaymentMethodsOptions) => {
      if (!widgets) {
        console.error('Widgets not initialized');
        return null;
      }

      try {
        const paymentMethodWidget = await widgets.renderPaymentMethods({
          selector: options.selector,
          variantKey: options.variantKey || 'DEFAULT'
        });

        return paymentMethodWidget;
      } catch (error) {
        console.error('Failed to render payment methods:', error);
        throw error;
      }
    },
    [widgets]
  );

  // 약관 UI 렌더링
  const renderAgreement = useCallback(
    async (options: RenderAgreementOptions) => {
      if (!widgets) {
        console.error('Widgets not initialized');
        return null;
      }

      try {
        const agreementWidget = await widgets.renderAgreement({
          selector: options.selector,
          variantKey: options.variantKey || 'AGREEMENT'
        });

        return agreementWidget;
      } catch (error) {
        console.error('Failed to render agreement:', error);
        throw error;
      }
    },
    [widgets]
  );

  // 결제 요청
  const requestPayment = useCallback(
    async (params: RequestPaymentParams) => {
      if (!widgets) {
        console.error('Widgets not initialized');
        return;
      }

      try {
        const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
        const currentParams = new URLSearchParams(window.location.search);
        const preserveParams = new URLSearchParams();
        utmParams.forEach((key) => {
          const val = currentParams.get(key);
          if (val) preserveParams.set(key, val);
        });
        const utmString = preserveParams.toString();
        const successUrl = `${window.location.origin}/payment/success${utmString ? '?' + utmString : ''}`;

        await widgets.requestPayment({
          orderId: params.orderId,
          orderName: params.orderName,
          successUrl,
          failUrl: `${window.location.origin}/payment/fail`,
          customerEmail: params.customerEmail || account?.email,
          customerName: params.customerName || account?.name || undefined
        });
      } catch (error) {
        console.error('Failed to request payment:', error);
        throw error;
      }
    },
    [widgets, account]
  );

  // 주문 생성 및 결제 시작 (통합 함수)
  const startPayment = useCallback(
    async (orderParams: PostTossOrderRequest) => {
      if (!widgets || !account) {
        throw new Error('Widgets or account not initialized');
      }

      try {
        // 1. 백엔드에서 주문 생성
        const orderResponse = await postTossOrder(orderParams);
        const orderData = orderResponse.data;

        // 2. 결제 금액 설정 (할인 적용된 금액 사용)
        await setAmount({
          currency: orderParams.currency || 'KRW',
          value: orderData.amount
        });

        // 3. 결제 요청
        await requestPayment({
          orderId: orderData.orderId,
          orderName: orderData.orderName,
          customerEmail: account.email,
          customerName: account.name || undefined
        });

        return orderResponse;
      } catch (error) {
        console.error('Failed to start payment:', error);
        throw error;
      }
    },
    [widgets, account, setAmount, requestPayment]
  );

  return {
    widgets,
    isReady,
    amount,
    setAmount,
    renderPaymentMethods,
    renderAgreement,
    requestPayment,
    startPayment,
    resetWidgets,
    account
  };
};
