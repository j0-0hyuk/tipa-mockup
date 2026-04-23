import { Flex } from '@docs-front/ui';
import {
  SideNavigationWidth,
  StyledProfileContainer,
  StyledResizeButton,
  StyledNavLogoBadge,
  StyledNavLogoImage,
  StyledSideNavigation,
  StyledSideNavigationHeader
} from '@/routes/_authenticated/-components/SideNavigation/SideNavigation.style';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { FlaskConical, Inbox, PanelLeft, MessageCircle, Home, Shield, Building2 } from 'lucide-react';
import { DLogo } from '@docs-front/ui';
import { useSideNavigation } from '@/routes/_authenticated/-components/SideNavigation/useSideNavigation';
import { useCallback, useState, useMemo, type PropsWithChildren } from 'react';
import type { SideNavigationContextProps } from '@/routes/_authenticated/-components/SideNavigation/SideNavigation.context';
import { SideNavigationContext } from '@/routes/_authenticated/-components/SideNavigation/SideNavigation.context';
import { Tooltip } from '@docs-front/ui';
import { useI18n } from '@/hooks/useI18n';
import { NavIcon } from '@/routes/_authenticated/-components/SideNavigation/components/deprecated/NavItem/NavItem';

export const SideNavigationProvider = ({ children }: PropsWithChildren) => {
  const [_open, _setOpen] = useState<boolean>(true);
  const open = _open;
  const setOpen = useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value;
      _setOpen(openState);
    },
    [open]
  );

  const toggleSidebar = useCallback(() => {
    return setOpen((open) => !open);
  }, [setOpen]);

  const contextValue = useMemo<SideNavigationContextProps>(
    () => ({
      open,
      setOpen,
      toggle: toggleSidebar
    }),
    [open, setOpen, toggleSidebar]
  );

  return (
    <SideNavigationContext.Provider value={contextValue}>
      {children}
    </SideNavigationContext.Provider>
  );
};

SideNavigationProvider.displayName = 'SideNavigationProvider';

function SideNavigationContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const { open, toggle } = useSideNavigation();
  const { t } = useI18n(['main']);

  const handleNavigate = (to: string) => {
    const blocked = (window as Window & { __unsavedWork?: boolean }).__unsavedWork;
    if (blocked) {
      window.dispatchEvent(new CustomEvent('nav-request', { detail: to }));
    } else {
      navigate({ to });
    }
  };

  return (
    <>
      <SideNavigationWidth $open={open} />
      <StyledSideNavigation $open={open}>
        <StyledSideNavigationHeader>
          <Flex
            alignItems="center"
            justify={open ? 'space-between' : 'center'}
            width="100%"
            padding={open ? '8px' : '8px 0'}
          >
            <Flex
              alignItems="center"
              gap="10px"
              style={{ cursor: 'pointer' }}
              onClick={open ? () => handleNavigate('/start') : toggle}
            >
              <StyledNavLogoBadge style={open ? undefined : { width: 36, height: 36 }}>
                <StyledNavLogoImage
                  src={`${import.meta.env.BASE_URL}images/chatbot/tipa-logo.png`}
                  alt="TIPA logo"
                  draggable={false}
                />
              </StyledNavLogoBadge>
              {open && (
                <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 700, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                  중소기업기술정보진흥원
                </span>
              )}
            </Flex>
            {open && (
              <Tooltip content={t('main:tooltip.fold')} side="bottom">
                <StyledResizeButton onClick={toggle}>
                  <PanelLeft size={20} />
                </StyledResizeButton>
              </Tooltip>
            )}
          </Flex>
          <Flex direction="column" width="100%">
            <NavIcon
              label="R&D 계획서 작성"
              icon={<FlaskConical size={20} strokeWidth={1.6} />}
              open={open}
              onClick={() => handleNavigate('/start2')}
              isActive={
                location.pathname === '/start2' ||
                location.pathname.startsWith('/start2/')
              }
            />
            <NavIcon
              label="기업정보 및 공고추천"
              icon={<Building2 size={20} strokeWidth={1.6} />}
              open={open}
              onClick={() => handleNavigate('/company')}
              isActive={
                location.pathname === '/company' ||
                location.pathname.startsWith('/company/')
              }
            />
            <NavIcon
              label="문서함"
              icon={<Inbox size={20} strokeWidth={1.6} />}
              open={open}
              onClick={() => handleNavigate('/d')}
              isActive={
                location.pathname === '/d' ||
                location.pathname.startsWith('/d/')
              }
            />
            <div style={{ height: 16 }} />
            <NavIcon
              label="챗봇 플로우"
              icon={<MessageCircle size={20} strokeWidth={1.6} />}
              open={open}
              onClick={() => handleNavigate('/chatbot-flow')}
              isActive={
                location.pathname === '/chatbot-flow' ||
                location.pathname.startsWith('/chatbot-flow/')
              }
            />
            <NavIcon
              label="홈페이지 플로우"
              icon={<Home size={20} strokeWidth={1.6} />}
              open={open}
              onClick={() => handleNavigate('/homepage-flow')}
              isActive={
                location.pathname === '/homepage-flow' ||
                location.pathname.startsWith('/homepage-flow/')
              }
            />
            <NavIcon
              label="관리자페이지"
              icon={<Shield size={20} strokeWidth={1.6} />}
              open={open}
              onClick={() => handleNavigate('/admin-demo')}
              isActive={
                location.pathname === '/admin-demo' ||
                location.pathname.startsWith('/admin-demo/')
              }
            />
          </Flex>
        </StyledSideNavigationHeader>
        <StyledProfileContainer>
          <Flex
            direction="row"
            gap={open ? 8 : 0}
            alignItems="center"
            justify="center"
            style={{ padding: open ? '8px' : '0', cursor: 'default', width: '100%' }}
          >
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#2C81FC',
              color: '#FFFFFF',
              fontSize: 15,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              김
            </div>
            {open && (
              <Flex direction="column" gap={2}>
                <span style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>
                  김민수
                </span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, letterSpacing: '-0.01em' }}>
                  minsu.kim@smtech.go.kr
                </span>
              </Flex>
            )}
          </Flex>
        </StyledProfileContainer>
      </StyledSideNavigation>
    </>
  );
}

export default function SideNavigation() {
  return <SideNavigationContent />;
}
