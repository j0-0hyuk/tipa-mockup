// __root.tsx
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';

import type { Auth } from '@/service/auth/instance';
import { NotFound } from '@/routes/-components/NotFound/NotFound';
import { initializePaddle } from '@paddle/paddle-js';
import type { QueryClient } from '@tanstack/react-query';
import { RootErrorComponent } from '@/routes/-components/RootErrorComponent/RootErrorComponent';
import { AnalyticsProvider } from '@/routes/-providers/AnalyticsProvider';
import { OverlayProvider } from 'overlay-kit';
import type { ToastContext } from '@docs-front/ui';

/**
 * 이벤트 종료 시각 (KST 2027-01-01 00:00:00 = UTC 2026-12-31 15:00:00)
 * 클라이언트 시간 체크는 UX 보조용이며, 최종 이벤트 종료 판단은 서버(validate/order API)가 수행합니다.
 */
const REFERRAL_EVENT_END = new Date('2026-12-31T15:00:00Z');

/** referralCode 기본 포맷 검증 (영숫자, 하이픈, 언더스코어, 3~50자) */
const isValidReferralCode = (code: string): boolean =>
  /^[a-zA-Z0-9_-]{3,50}$/.test(code);

interface RootSearch {
  funnelSteps?: Record<string, string>;
  ref?: string;
}

type RouterContext = {
  auth: Auth;
  queryClient: QueryClient;
  toast: ToastContext;
};

function RootComponent() {
  useEffect(() => {
    // URL에서 ref 파라미터 제거 (clean URL 유지)
    const url = new URL(window.location.href);
    if (url.searchParams.has('ref')) {
      url.searchParams.delete('ref');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  return (
    <AnalyticsProvider>
      <OverlayProvider>
        <Outlet />
        {/* <TanStackRouterDevtools /> */}
      </OverlayProvider>
    </AnalyticsProvider>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  validateSearch: (search: Record<string, unknown>): RootSearch => {
    if (search.funnelSteps) {
      return {
        ...search,
        funnelSteps: search.funnelSteps as Record<string, string>
      };
    }
    return search;
  },
  beforeLoad: ({ search }) => {
    // ref 파라미터를 beforeLoad에서 저장 (자식 라우트의 redirect 전에 실행됨)
    const ref = typeof search.ref === 'string' ? search.ref.trim() : undefined;
    if (!ref) return;

    // 이벤트 종료 후에는 저장하지 않음
    if (new Date() >= REFERRAL_EVENT_END) return;

    // 무효 포맷이면 저장하지 않음
    if (!isValidReferralCode(ref)) return;

    // last-touch: 항상 덮어쓰기
    localStorage.setItem('referralCode', ref);
  },
  loader: () => {
    // 프로토타입 빌드에서는 Paddle 환경변수가 없으므로 초기화 스킵
    if (import.meta.env.VITE_IS_PROTOTYPE === 'true') return;

    const paddleEnvironment = import.meta.env.VITE_PADDLE_ENVIRONMENT;
    const paddleToken = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;
    if (!paddleEnvironment || !paddleToken) return;

    try {
      initializePaddle({
        environment: paddleEnvironment,
        token: paddleToken
      });
    } catch (error) {
      console.warn('[paddle] initialize skipped:', error);
    }
  },
  notFoundComponent: NotFound,
  errorComponent: RootErrorComponent
});
