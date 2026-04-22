import { Flex } from '@bichon/ds';
import { useLocation } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import {
  SidebarContainer,
  SidebarLink,
  SidebarExternalLink,
  SidebarItem,
  SidebarIcon,
  SidebarLabel
} from '@/components/Sidebar/Sidebar.style';

interface SidebarMenuData {
  to?: string; // 내부 라우트
  href?: string; // 외부 링크
  label: string;
  icon: ReactNode;
  external?: boolean;
}

const sidebarItems: SidebarMenuData[] = [
  {
    to: '/main',
    label: '대시보드',
    icon: <span>📊</span>
  },
  {
    to: '/users',
    label: '사용자 관리',
    icon: <span>👥</span>
  },
  {
    to: '/coupons',
    label: '쿠폰 관리',
    icon: <span>🎫</span>
  },
  {
    to: '/template',
    label: '템플릿 업로드',
    icon: <span>📤</span>
  },
  {
    to: '/template-list',
    label: '파일 조회',
    icon: <span>📋</span>
  },
  {
    to: '/template-preprocess',
    label: '템플릿 전처리',
    icon: <span>🪄</span>
  }
];

const externalLinks: SidebarMenuData[] = [
  {
    href: 'http://app.docshunt.ai:9999/dashboards?order=-created_at&page=1&page_size=20',
    label: 'Redash',
    icon: <span>📈</span>,
    external: true
  },
  {
    href: 'https://vendors.paddle.com/overview/billing',
    label: 'Paddle 대시보드',
    icon: <span>💳</span>,
    external: true
  }
];

export function Sidebar() {
  const location = useLocation();

  const renderMenuItem = (item: SidebarMenuData, index: number) => {
    const isActive = item.to ? location.pathname === item.to : false;
    const key = item.to || item.href || index;

    const menuContent = (
      <SidebarItem $isActive={isActive}>
        <SidebarIcon>{item.icon}</SidebarIcon>
        <SidebarLabel $isActive={isActive}>{item.label}</SidebarLabel>
      </SidebarItem>
    );

    if (item.external && item.href) {
      return (
        <SidebarExternalLink
          key={key}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {menuContent}
        </SidebarExternalLink>
      );
    }

    return (
      <SidebarLink key={key} to={item.to!}>
        {menuContent}
      </SidebarLink>
    );
  };

  return (
    <SidebarContainer direction="column">
      <Flex direction="column" gap={4} padding="0 16px">
        {/* 내부 메뉴 */}
        {sidebarItems.map((item, index) => renderMenuItem(item, index))}

        {/* 구분선 */}
        <div
          style={{
            height: '1px',
            backgroundColor: '#e2e8f0',
            margin: '16px 0'
          }}
        />

        {/* 외부 링크 */}
        {externalLinks.map((item, index) => renderMenuItem(item, index + 100))}
      </Flex>
    </SidebarContainer>
  );
}
