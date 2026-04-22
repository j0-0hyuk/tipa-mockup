import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

export const colors = {
  navy: '#2B4C80',
  navyDark: '#1F3A66',
  blue: '#3A6BC1',
  blueLight: '#5A8AD8',
  blueBg: '#EAF1FB',
  white: '#FFFFFF',
  bg: '#F5F7FA',
  bgAlt: '#FAFBFD',
  border: '#DFE3EA',
  borderLight: '#EAEDF2',
  text: '#1F2937',
  textSub: '#4B5563',
  textMuted: '#6B7280',
  textLight: '#9CA3AF',
  accent: '#D84A38',
  highlight: '#2C81FC',
  highlightSoft: '#E7F0FF',
};

// ─── Root ────────────────────────────────────
export const StyledPageRoot = styled.div`
  width: 100%;
  min-height: calc(100vh - 64px);
  background: ${colors.white};
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
`;

export const StyledContainer = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  width: 100%;
  padding: 0 24px;
`;

// ─── TopNoticeBar ────────────────────────────
export const StyledTopNoticeBar = styled.div`
  background: linear-gradient(90deg, ${colors.navyDark} 0%, ${colors.navy} 100%);
  color: ${colors.white};
  padding: 14px 0;
`;

export const StyledTopNoticeInner = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

export const StyledTopNoticeTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  flex: 1;
`;

export const StyledTopNoticeBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.18);
  color: ${colors.white};
  letter-spacing: 0;
`;

export const StyledTopNoticeButton = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: ${colors.white};
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  transition: background 140ms ease;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
`;

// ─── SiteHeader ──────────────────────────────
export const StyledSiteHeader = styled.header`
  background: ${colors.white};
  border-bottom: 1px solid ${colors.border};
`;

export const StyledHeaderInner = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 24px;
  height: 80px;
  display: flex;
  align-items: center;
  gap: 40px;
`;

export const StyledLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${colors.navy};
  font-weight: 700;
  font-size: 16px;
  letter-spacing: -0.02em;
  white-space: nowrap;
`;

export const StyledLogoMark = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const StyledNavMenu = styled.nav`
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 38px;
`;

export const StyledNavItem = styled.a`
  color: ${colors.text};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: -0.01em;
  transition: color 120ms ease;

  &:hover {
    color: ${colors.blue};
  }
`;

export const StyledHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const StyledHeaderLink = styled.span`
  font-size: 13px;
  color: ${colors.textSub};
  cursor: pointer;

  &:hover {
    color: ${colors.text};
  }
`;

export const StyledHeaderDivider = styled.span`
  width: 1px;
  height: 10px;
  background: ${colors.border};
`;

export const StyledHeaderIconBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${colors.border};
  background: ${colors.white};
  color: ${colors.textSub};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

// ─── QuickServices ───────────────────────────
const cardGlow = keyframes`
  0%, 100% {
    box-shadow:
      0 0 0 2px ${colors.highlightSoft},
      0 4px 14px -4px rgba(44, 129, 252, 0.22),
      0 2px 6px rgba(15, 23, 42, 0.06);
  }
  50% {
    box-shadow:
      0 0 0 3px #D4E4FC,
      0 10px 24px -6px rgba(44, 129, 252, 0.32),
      0 2px 6px rgba(15, 23, 42, 0.06);
  }
`;

const badgePulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(216, 74, 56, 0.55); }
  50% { box-shadow: 0 0 0 5px rgba(216, 74, 56, 0); }
`;

export const StyledQuickSection = styled.section`
  background: linear-gradient(180deg, ${colors.blue} 0%, #4577C7 100%);
  padding: 44px 0 56px;
  color: ${colors.white};
`;

export const StyledQuickHeader = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 24px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const StyledQuickAccent = styled.span`
  width: 4px;
  height: 22px;
  background: ${colors.white};
  border-radius: 2px;
`;

export const StyledQuickTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.02em;
`;

export const StyledQuickGrid = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
`;

export const StyledQuickCard = styled.button<{ $highlighted?: boolean }>`
  background: ${colors.white};
  border: none;
  border-radius: 6px;
  padding: 22px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  position: relative;
  transition: transform 160ms ease, box-shadow 160ms ease;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
  ${(p) => p.$highlighted && `animation: ${cardGlow} 2.6s ease-in-out infinite;`}

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 24px -8px rgba(15, 23, 42, 0.18);
  }
`;

export const StyledQuickIconWrap = styled.div<{ $highlighted?: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => (p.$highlighted ? colors.highlightSoft : colors.bg)};
  color: ${(p) => (p.$highlighted ? colors.highlight : colors.blue)};
`;

export const StyledQuickLabel = styled.span<{ $highlighted?: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => (p.$highlighted ? colors.highlight : colors.text)};
  letter-spacing: -0.01em;
  text-align: center;
`;

export const StyledNewBadge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${colors.accent};
  color: ${colors.white};
  font-size: 10px;
  font-weight: 800;
  padding: 3px 7px;
  border-radius: 10px;
  letter-spacing: 0.04em;
  animation: ${badgePulse} 1.8s ease-in-out infinite;
`;

// ─── NoticeList ──────────────────────────────
export const StyledNoticeSection = styled.section`
  padding: 56px 0 40px;
  background: ${colors.white};
`;

export const StyledNoticeHeader = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 24px 20px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  border-bottom: 2px solid ${colors.navy};
`;

export const StyledNoticeTabs = styled.div`
  display: flex;
  gap: 4px;
`;

export const StyledNoticeTab = styled.button<{ $active?: boolean }>`
  padding: 12px 22px;
  border: none;
  background: ${(p) => (p.$active ? colors.navy : 'transparent')};
  color: ${(p) => (p.$active ? colors.white : colors.textSub)};
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
  letter-spacing: -0.01em;
`;

export const StyledNoticeMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  font-size: 13px;
  color: ${colors.textMuted};
`;

export const StyledNoticeMetaSep = styled.span`
  width: 1px;
  height: 10px;
  background: ${colors.border};
`;

export const StyledNoticeMetaLink = styled.a`
  color: ${colors.navy};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`;

export const StyledNoticeGrid = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding: 28px 24px 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;

export const StyledNoticeCard = styled.article`
  background: ${colors.white};
  border: 1px solid ${colors.borderLight};
  border-radius: 6px;
  padding: 22px 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 220px;
  transition: box-shadow 160ms ease, transform 160ms ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 10px 24px -10px rgba(15, 23, 42, 0.18);
    transform: translateY(-2px);
  }
`;

export const StyledNoticeBadge = styled.span`
  display: inline-flex;
  align-self: flex-start;
  padding: 4px 10px;
  background: ${colors.blueBg};
  color: ${colors.blue};
  font-size: 11px;
  font-weight: 700;
  border-radius: 3px;
  letter-spacing: -0.01em;
`;

export const StyledNoticeTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${colors.text};
  margin: 0;
  line-height: 1.45;
  letter-spacing: -0.02em;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`;

export const StyledNoticeFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px dashed ${colors.borderLight};
`;

export const StyledNoticeDates = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: ${colors.textMuted};
`;

export const StyledNoticeDday = styled.span`
  font-weight: 700;
  color: ${colors.accent};
`;

export const StyledNoticeAiLink = styled.button`
  margin-top: 4px;
  border: 1px solid ${colors.highlightSoft};
  background: ${colors.highlightSoft};
  color: ${colors.highlight};
  font-size: 12px;
  font-weight: 700;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  letter-spacing: -0.01em;
  transition: background 140ms ease, border-color 140ms ease;

  &:hover {
    background: ${colors.highlight};
    color: ${colors.white};
    border-color: ${colors.highlight};
  }
`;

// ─── CtaBanner ───────────────────────────────
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

export const StyledCtaSection = styled.section`
  padding: 48px 0 72px;
  background: ${colors.bgAlt};
`;

export const StyledCtaBanner = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding: 36px 48px;
  background: linear-gradient(120deg, ${colors.blueBg} 0%, #F0F6FF 100%);
  border: 1px solid #CFE0F7;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
`;

export const StyledCtaText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const StyledCtaEyebrow = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${colors.blue};
  letter-spacing: 0.02em;
`;

export const StyledCtaTitle = styled.h3`
  font-size: 22px;
  font-weight: 800;
  color: ${colors.text};
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1.4;
`;

export const StyledCtaButton = styled.button`
  background: linear-gradient(90deg, ${colors.highlight} 0%, #5AA3FF 50%, ${colors.highlight} 100%);
  background-size: 200% 100%;
  animation: ${shimmer} 3.2s linear infinite;
  color: ${colors.white};
  border: none;
  padding: 16px 28px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 10px 20px -6px rgba(44, 129, 252, 0.45);
  letter-spacing: -0.01em;
  white-space: nowrap;
  transition: transform 160ms ease, box-shadow 160ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 28px -8px rgba(44, 129, 252, 0.55);
  }
`;
