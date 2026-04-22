import { createFileRoute, Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Flex } from '@docs-front/ui';
import {
  LayoutDashboard,
  Users as UsersIcon,
  FileText,
  TrendingUp,
  Shield,
} from 'lucide-react';
import {
  StyledAdminRoot,
  StyledAdminNav,
  StyledAdminNavHeader,
  StyledAdminNavItem,
  StyledAdminMain,
} from './-admin.style';

export const Route = createFileRoute('/_authenticated/admin-demo')({
  component: AdminLayout,
});

const NAV_ITEMS = [
  { path: '/admin-demo', label: '대시보드', Icon: LayoutDashboard, exact: true },
  { path: '/admin-demo/users', label: '사용자 관리', Icon: UsersIcon },
  { path: '/admin-demo/documents', label: '생성 문서 현황', Icon: FileText },
  { path: '/admin-demo/quality', label: '서비스 품질', Icon: TrendingUp },
];

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.ChannelIO?.('hideChannelButton');
    return () => {
      window.ChannelIO?.('showChannelButton');
    };
  }, []);

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <StyledAdminRoot>
      <StyledAdminNav>
        <StyledAdminNavHeader>
          <Shield size={18} strokeWidth={2} color="#2C81FC" />
          <span>TIPA 관리자 콘솔</span>
        </StyledAdminNavHeader>
        <Flex direction="column" gap="2px">
          {NAV_ITEMS.map(({ path, label, Icon, exact }) => (
            <StyledAdminNavItem
              key={path}
              $active={isActive(path, exact)}
              onClick={() => navigate({ to: path as any })}
            >
              <Icon size={16} strokeWidth={1.8} />
              <span>{label}</span>
            </StyledAdminNavItem>
          ))}
        </Flex>
      </StyledAdminNav>
      <StyledAdminMain>
        <Outlet />
      </StyledAdminMain>
    </StyledAdminRoot>
  );
}
