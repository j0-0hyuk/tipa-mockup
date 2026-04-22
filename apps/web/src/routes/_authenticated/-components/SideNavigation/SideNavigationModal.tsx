import { Flex } from '@docs-front/ui';
import {
  StyledModalOverlay,
  StyledNavLogoBadge,
  StyledNavLogoImage,
  StyledProfileContainer,
  StyledResizeButton,
  StyledSideNavigationHeader,
  StyledSideNavigationModal
} from '@/routes/_authenticated/-components/SideNavigation/SideNavigation.style';
import { FlaskConical, Inbox, MessageCircle, Home, Shield, PanelLeft } from 'lucide-react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useSideNavigationModalStore } from '@/store/useSideNavigationModalStore';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { NavIcon } from '@/routes/_authenticated/-components/SideNavigation/components/deprecated/NavItem/NavItem';

export default function SideNavigationModal() {
  const navigate = useNavigate();
  const { close } = useSideNavigationModalStore();
  const { sm } = useBreakPoints();
  const location = useLocation();

  const handleNavigate = (to: string) => {
    navigate({ to });
    close();
  };

  const handleClose = () => {
    close();
  };

  return (
    <>
      <StyledModalOverlay onClick={handleClose} />
      <StyledSideNavigationModal sm={sm}>
        <StyledSideNavigationHeader>
          <Flex
            alignItems="center"
            justify="space-between"
            width="100%"
            padding={'10px 12px'}
          >
            <Flex
              alignItems="center"
              gap="10px"
              style={{ cursor: 'pointer' }}
              onClick={() => handleNavigate('/start')}
            >
              <StyledNavLogoBadge>
                <StyledNavLogoImage
                  src={`${import.meta.env.BASE_URL}images/chatbot/tipa-logo.png`}
                  alt="TIPA logo"
                  draggable={false}
                />
              </StyledNavLogoBadge>
              <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 700, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                중소기업기술정보진흥원
              </span>
            </Flex>
            <StyledResizeButton onClick={handleClose} style={{ cursor: 'pointer' }}>
              <PanelLeft size={20} />
            </StyledResizeButton>
          </Flex>
          <Flex direction="column" width="100%">
            <NavIcon
              label="R&D 계획서 작성"
              icon={<FlaskConical size={20} strokeWidth={1.6} />}
              open={true}
              onClick={() => handleNavigate('/start2')}
              isActive={
                location.pathname === '/start2' ||
                location.pathname.startsWith('/start2/')
              }
            />
            <NavIcon
              label="문서함"
              icon={<Inbox size={20} strokeWidth={1.6} />}
              open={true}
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
              open={true}
              onClick={() => handleNavigate('/chatbot-flow')}
              isActive={
                location.pathname === '/chatbot-flow' ||
                location.pathname.startsWith('/chatbot-flow/')
              }
            />
            <NavIcon
              label="홈페이지 플로우"
              icon={<Home size={20} strokeWidth={1.6} />}
              open={true}
              onClick={() => handleNavigate('/homepage-flow')}
              isActive={
                location.pathname === '/homepage-flow' ||
                location.pathname.startsWith('/homepage-flow/')
              }
            />
            <NavIcon
              label="관리자페이지"
              icon={<Shield size={20} strokeWidth={1.6} />}
              open={true}
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
            gap={8}
            alignItems="center"
            justify="center"
            style={{ padding: '8px', cursor: 'default', width: '100%' }}
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
            <Flex direction="column" gap={2}>
              <span style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>
                김민수
              </span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, letterSpacing: '-0.01em' }}>
                minsu.kim@smtech.go.kr
              </span>
            </Flex>
          </Flex>
        </StyledProfileContainer>
      </StyledSideNavigationModal>
    </>
  );
}
