import { useEffect, useCallback, type ReactNode } from 'react';
import { useLocation } from '@tanstack/react-router';
import { useAnalytics, type UserType } from '@/hooks/useAnalytics';
import { useAuth } from '@/service/auth/hook';
import { useQuery } from '@tanstack/react-query';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { isMockupRoutePath } from '@/routes/_authenticated/-utils/mockupRoutes';

interface AnalyticsProviderProps {
  children: ReactNode;
}

/**
 * 페이지 변경 시 자동으로 pageView 이벤트를 전송하는 Provider
 */
export const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => {
  const { pageView } = useAnalytics();
  const auth = useAuth();
  const location = useLocation();

  const isPrototype = import.meta.env.VITE_IS_PROTOTYPE === 'true';
  const isMockupRoute = isMockupRoutePath(location.pathname);
  const { data: accountData } = useQuery({
    ...getAccountMeQueryOptions(),
    enabled: auth.isLogined && !isPrototype && !isMockupRoute
  });

  const getUserTypeAndId = useCallback((): {
    userType: UserType;
    userId?: number;
  } => {
    if (!auth.isLogined) {
      return { userType: 'guest' };
    }

    if (!accountData) {
      return { userType: 'free_user', userId: undefined };
    }

    const { id, role } = accountData;

    const userType: UserType =
      role === 'SUB' ? 'subscriber' : role === 'ADMIN' ? 'admin' : 'free_user';

    return { userType, userId: id };
  }, [auth.isLogined, accountData]);

  useEffect(() => {
    const { userType, userId } = getUserTypeAndId();
    pageView(userType, userId, location.pathname);
  }, [location.pathname, getUserTypeAndId, pageView]);

  return <>{children}</>;
};
