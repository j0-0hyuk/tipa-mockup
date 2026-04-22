import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useToast, Flex } from '@bichon/ds';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { Header } from '@/components/Header/Header';
import { useAuthContext } from '@/hooks/useAuth';

/** _authenticated 디렉토리 파일 라우트 생성 */
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const { isLogined } = context.authentication;

    // 로그인 체크만 수행
    if (!isLogined.current) {
      throw redirect({ to: '/login' });
    }
  },
  component: AuthenticatedLayout
});

function AuthenticatedLayout() {
  const { isAdmin, isLoading, signOut } = useAuthContext();
  const toast = useToast();

  useEffect(() => {
    // 로딩 완료 후에만 Admin 권한 체크 수행
    if (!isLoading && !isAdmin) {
      toast.showToast('관리자 권한이 없는 계정입니다. 로그아웃됩니다.', {
        duration: 2000
      });

      // 약간의 지연 후 로그아웃 (토스트를 보여주기 위함)
      setTimeout(() => {
        void signOut();
      }, 2000);
    }
  }, [isAdmin, isLoading, signOut, toast]);

  // 로딩 중이거나 Admin이 아니면 로딩 상태 표시
  if (isLoading || !isAdmin) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div>권한을 확인하는 중...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />
      <Flex>
        <Sidebar />
        <div style={{ flex: 1, padding: '24px' }}>
          <Outlet />
        </div>
      </Flex>
    </div>
  );
}
