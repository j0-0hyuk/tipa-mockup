import { useCallback } from 'react';
import TagManager from 'react-gtm-module';

type GTMEvent = {
  event: string;
  [key: string]: string | number | undefined;
};

export type UserType = 'guest' | 'free_user' | 'subscriber' | 'admin';

const gtmEvent = (event: GTMEvent) => {
  if (import.meta.env.VITE_ENVIRONMENT === 'prod') {
    TagManager.dataLayer({ dataLayer: event });
  }
};

export const useAnalytics = () => {
  /**
   * 비회원/회원/구독자별 페이지 방문 추적 이벤트
   */
  const pageView = useCallback(
    (userType: UserType, userId?: number, pagePath?: string) => {
      gtmEvent({
        event: 'page_view',
        user_type: userType,
        user_id: userId,
        page_path: pagePath || window.location.pathname,
        timestamp: new Date().toISOString()
      });
    },
    []
  );

  const signUp = useCallback((method?: string) => {
    gtmEvent({ event: 'sign_up', method: method || 'google' });
  }, []);

  const beginCheckout = useCallback(
    (planName?: string, value?: number, currency?: string) => {
      gtmEvent({
        event: 'begin_checkout',
        plan_name: planName,
        value,
        currency: currency || 'USD'
      });
    },
    []
  );

  return { pageView, signUp, beginCheckout };
};
