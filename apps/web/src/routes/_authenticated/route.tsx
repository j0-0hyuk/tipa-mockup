import SideNavigation, {
  SideNavigationProvider
} from '@/routes/_authenticated/-components/SideNavigation/SideNavigation';
import { useNoticeModal } from '@/routes/-components/NoticeModal/NoticeModal.hook';
import { useRecommendedBrowserModal } from '@/routes/_authenticated/-components/RecommendedBrowserModal/RecommendedBrowserModal.hook';
import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation
} from '@tanstack/react-router';

import styled from '@emotion/styled';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { HomeNavbar } from '@/routes/_authenticated/c/-components/Toolbar/Toolbar';
import { isMockupRoutePath } from '@/routes/_authenticated/-utils/mockupRoutes';

const StyledWrapper = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  flex: 1 1 0;
  min-height: 0;
  height: 100%;
  overflow-x: visible;
  flex-direction: ${({ $isMobile }) => ($isMobile ? 'column' : 'row')};
`;

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
  beforeLoad: async ({ context, location }) => {
    const { isLogined } = context.auth;
    if (isMockupRoutePath(location.pathname)) {
      return;
    }
    if (!isLogined) {
      // 로그인 후 돌아올 URL 저장 (쿼리 파라미터 포함)
      // TanStack Router에서 location.search는 객체이므로 쿼리 문자열로 변환
      const searchParams = new URLSearchParams(
        location.search as Record<string, string>
      ).toString();
      const currentPath =
        location.pathname + (searchParams ? `?${searchParams}` : '');
      if (currentPath !== '/') {
        localStorage.setItem('redirectTo', currentPath);
      }
      throw redirect({ to: '/' });
    }
  }
});

function RouteComponent() {
  const { isMobile } = useBreakPoints();
  const location = useLocation();

  useRecommendedBrowserModal();
  useNoticeModal();

  // 모바일에서 /c/$productId 화면에서는 HomeNavbar를 숨김
  const isProductDetailRoute = /\/c\/[^/]+$/.test(location.pathname);

  return (
    <SideNavigationProvider>
      <StyledWrapper $isMobile={isMobile}>
        {isMobile ? (
          isProductDetailRoute ? null : (
            <HomeNavbar />
          )
        ) : (
          <SideNavigation />
        )}
        <Outlet />
      </StyledWrapper>
    </SideNavigationProvider>
  );
}
