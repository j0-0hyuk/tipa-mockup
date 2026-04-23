import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

export const colors = {
  bg: '#F5F7FB',
  bgGradientTop: '#EEF3FB',
  bgGradientBottom: '#F7F9FC',
  main: '#2C81FC',
  mainDark: '#1E6BE0',
  mainSoft: '#E7F0FF',
  white: '#FFFFFF',
  border: '#E5E9F0',
  borderLight: '#EEF1F5',
  text: '#0F172A',
  textMuted: '#64748B',
  textSub: '#94A3B8',
  userBubble: '#2C81FC',
  aiBubble: '#FFFFFF',
};

// ─── Page Root ───────────────────────────────
export const StyledPageRoot = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 64px);
  background: linear-gradient(180deg, ${colors.bgGradientTop} 0%, ${colors.bgGradientBottom} 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// ─── Stage 1: Launcher ────────────────────────
const circleRing = keyframes`
  0%   { transform: scale(1);    opacity: 0.5; }
  100% { transform: scale(1.3);  opacity: 0; }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const StyledLauncherWrap = styled.div<{ $exiting: boolean }>`
  box-sizing: border-box;
  width: min(720px, calc(100vw - 48px));
  padding: 36px 48px;
  background: linear-gradient(120deg, ${colors.mainSoft} 0%, #f0f6ff 100%);
  border: 1px solid #cfe0f7;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 36px;
  box-shadow: 0 22px 48px -28px rgba(15, 23, 42, 0.32);
  opacity: ${(p) => (p.$exiting ? 0 : 1)};
  transform: ${(p) => (p.$exiting ? 'scale(0.92)' : 'scale(1)')};
  transition: opacity 320ms ease, transform 320ms ease;
  animation: ${fadeInUp} 480ms ease both;

  @media (max-width: 640px) {
    width: min(420px, calc(100vw - 32px));
    padding: 32px 28px;
    flex-direction: column-reverse;
    justify-content: center;
    gap: 28px;
    text-align: center;
  }
`;

export const StyledLauncherButton = styled.button`
  position: relative;
  border: none;
  cursor: pointer;
  background: transparent;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 200ms ease;

  &:hover {
    transform: scale(1.06);
  }

  &:active {
    transform: scale(0.96);
  }
`;

export const StyledLauncherRing = styled.div<{ $delay: number }>`
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(44, 129, 252, 0.46);
  animation: ${circleRing} 2.4s ease-out infinite;
  animation-delay: ${(p) => p.$delay}s;
  pointer-events: none;
`;

export const StyledLauncherLogoBadge = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow:
    0 8px 32px rgba(15, 23, 42, 0.12),
    0 2px 8px rgba(15, 23, 42, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;

  img {
    width: 120%;
    height: 120%;
    object-fit: contain;
    display: block;
    user-select: none;
    pointer-events: none;
  }
`;

export const StyledLauncherText = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 14px;
`;

export const StyledLauncherTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const StyledLauncherName = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${colors.text};
  letter-spacing: 0;
  line-height: 1.2;
  display: flex;
  align-items: baseline;
  gap: 1px;

  @media (max-width: 640px) {
    justify-content: center;
  }
`;

export const StyledLauncherNameSub = styled.span`
  font-size: 19px;
  font-weight: 400;
  color: ${colors.textMuted};
  letter-spacing: 0;
  line-height: 1.2;
`;

export const StyledLauncherTagline = styled.div`
  font-size: 16px;
  color: ${colors.textMuted};
  letter-spacing: 0;
  line-height: 1.45;
`;

export const StyledLauncherHint = styled.div`
  font-size: 16px;
  color: ${colors.textMuted};
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1.45;
`;

// ─── Stage 2: Widget ─────────────────────────
const cardEnter = keyframes`
  from { opacity: 0; transform: translateY(16px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

export const StyledWidget = styled.div<{ $exiting: boolean }>`
  width: 480px;
  height: calc(100vh - 80px);
  max-height: calc(100vh - 80px);
  min-height: 640px;
  background: ${colors.white};
  border-radius: 24px;
  box-shadow: 0 32px 80px -24px rgba(15, 23, 42, 0.25), 0 12px 32px -8px rgba(15, 23, 42, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid ${colors.borderLight};
  animation: ${cardEnter} 480ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  opacity: ${(p) => (p.$exiting ? 0 : 1)};
  transform: ${(p) => (p.$exiting ? 'translateY(-8px) scale(0.98)' : 'translateY(0) scale(1)')};
  transition: opacity 360ms ease, transform 360ms ease;
`;

export const StyledWidgetHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid ${colors.borderLight};
  background: ${colors.white};
`;

export const StyledWidgetAvatar = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
`;

export const StyledWidgetLogoBadge = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    user-select: none;
    pointer-events: none;
  }
`;

export const StyledWidgetHeaderText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const StyledWidgetName = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: ${colors.text};
  letter-spacing: -0.01em;
  display: flex;
  align-items: baseline;
  gap: 1px;
`;

export const StyledWidgetNameSub = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: ${colors.textMuted};
  letter-spacing: 0;
`;

export const StyledWidgetStatus = styled.div`
  font-size: 13px;
  color: #10B981;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10B981;
  }
`;

export const StyledHeaderIconBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: ${colors.textMuted};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 120ms ease;

  &:hover {
    background: ${colors.bg};
    color: ${colors.text};
  }
`;

// ─── Sender Label (KakaoTalk-style) ─────────
export const StyledSenderRow = styled.div<{ $side: 'ai' | 'user' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: ${(p) => (p.$side === 'user' ? 'flex-end' : 'flex-start')};
  margin-top: 8px;
`;

export const StyledSenderAvatar = styled.div<{ $user?: boolean }>`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  background: ${(p) => (p.$user ? colors.main : 'transparent')};
  color: ${colors.white};
  font-size: 16px;
  font-weight: 700;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export const StyledSenderName = styled.span<{ $side: 'ai' | 'user' }>`
  font-size: ${(p) => (p.$side === 'ai' ? '17px' : '16px')};
  font-weight: 700;
  color: ${(p) => (p.$side === 'ai' ? colors.text : colors.textMuted)};
  letter-spacing: ${(p) => (p.$side === 'ai' ? '-0.01em' : '0')};

  ${(p) =>
    p.$side === 'ai' &&
    `
      display: flex;
      align-items: baseline;
      gap: 1px;

      span:last-of-type {
        font-size: 13px;
        font-weight: 400;
        color: ${colors.textMuted};
        letter-spacing: 0;
      }
    `}
`;

export const StyledMessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #FAFBFD;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${colors.border};
    border-radius: 3px;
  }
`;

export const StyledWidgetInput = styled.div`
  padding: 14px 16px;
  border-top: 1px solid ${colors.borderLight};
  background: ${colors.white};
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StyledFakeInput = styled.div`
  flex: 1;
  height: 40px;
  background: ${colors.bg};
  border-radius: 12px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${colors.textSub};
  letter-spacing: -0.01em;
`;

export const StyledSendBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: none;
  background: ${colors.mainSoft};
  color: ${colors.main};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: not-allowed;
`;

// ─── Messages ────────────────────────────────
const bubbleIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const StyledMessageRow = styled.div<{ $side: 'ai' | 'user' }>`
  display: flex;
  justify-content: ${(p) => (p.$side === 'user' ? 'flex-end' : 'flex-start')};
  animation: ${bubbleIn} 280ms ease both;
`;

export const StyledBubble = styled.div<{ $side: 'ai' | 'user' }>`
  max-width: 78%;
  padding: 12px 16px;
  border-radius: ${(p) => (p.$side === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px')};
  background: ${(p) => (p.$side === 'user' ? colors.userBubble : colors.aiBubble)};
  color: ${(p) => (p.$side === 'user' ? colors.white : colors.text)};
  font-size: 15px;
  line-height: 1.6;
  letter-spacing: -0.01em;
  white-space: pre-wrap;
  word-break: keep-all;
  box-shadow: ${(p) =>
    p.$side === 'ai' ? '0 1px 2px rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(15, 23, 42, 0.04)' : 'none'};
`;

// ─── Typing Indicator ────────────────────────
const dotBounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); opacity: 0.3; }
  40% { transform: translateY(-4px); opacity: 1; }
`;

export const StyledTypingWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 14px 18px;
  background: ${colors.white};
  border-radius: 18px 18px 18px 4px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(15, 23, 42, 0.04);
  width: fit-content;
  animation: ${bubbleIn} 220ms ease both;
`;

export const StyledTypingDot = styled.span<{ $i: number }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${colors.textMuted};
  animation: ${dotBounce} 1.2s ease-in-out infinite;
  animation-delay: ${(p) => p.$i * 0.15}s;
`;

// ─── CTA Card ────────────────────────────────
const ctaPop = keyframes`
  from { opacity: 0; transform: translateY(12px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

export const StyledCtaCard = styled.div`
  margin-top: 4px;
  padding: 18px;
  border-radius: 18px;
  background: ${colors.white};
  border: 1px solid ${colors.borderLight};
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(44, 129, 252, 0.08);
  animation: ${ctaPop} 440ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  max-width: 92%;
`;

export const StyledCtaTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.textMuted};
  display: flex;
  align-items: center;
  gap: 6px;
  letter-spacing: -0.01em;
`;

export const StyledCtaButton = styled.button`
  height: 52px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(
    90deg,
    ${colors.main} 0%,
    #5AA3FF 50%,
    ${colors.main} 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 3.2s linear infinite;
  color: ${colors.white};
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 8px 20px -6px rgba(44, 129, 252, 0.5);
  transition: transform 160ms ease, box-shadow 160ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 28px -8px rgba(44, 129, 252, 0.6);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const StyledCtaSub = styled.div`
  font-size: 13px;
  color: ${colors.textSub};
  text-align: center;
  letter-spacing: -0.01em;
`;

// ─── Scenario Chips ──────────────────────────
export const StyledChipsCard = styled.div`
  margin-top: 4px;
  padding: 14px;
  border-radius: 18px;
  background: ${colors.white};
  border: 1px solid ${colors.borderLight};
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  animation: ${ctaPop} 360ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  max-width: 92%;
`;

export const StyledChipsTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.text};
  letter-spacing: 0;
  padding: 0 2px 2px;
`;

export const StyledChipsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const StyledChip = styled.button<{ $disabled?: boolean; $dimmed?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${colors.borderLight};
  background: #FBFCFE;
  cursor: ${(p) => (p.$disabled ? 'default' : 'pointer')};
  text-align: left;
  opacity: ${(p) => (p.$dimmed ? 0.6 : 1)};
  filter: none;
  transition: transform 140ms ease, border-color 140ms ease, background 140ms ease, box-shadow 140ms ease, opacity 160ms ease;

  &:hover {
    border-color: ${(p) => (p.$disabled ? colors.borderLight : colors.main)};
    background: ${(p) => (p.$disabled ? '#FBFCFE' : colors.mainSoft)};
    transform: ${(p) => (p.$disabled ? 'none' : 'translateX(2px)')};
    box-shadow: ${(p) => (p.$disabled ? 'none' : '0 4px 12px -4px rgba(44, 129, 252, 0.2)')};
  }

  &:active {
    transform: ${(p) => (p.$disabled ? 'none' : 'translateX(0)')};
  }
`;

export const StyledChipIcon = styled.span`
  font-size: 22px;
  line-height: 1;
  flex-shrink: 0;
`;

export const StyledChipLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;

  strong {
    font-size: 14px;
    font-weight: 700;
    color: ${colors.text};
    letter-spacing: -0.01em;
  }

  span {
    font-size: 13px;
    color: ${colors.textMuted};
    letter-spacing: -0.01em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const StyledChipsDivider = styled.div`
  height: 1px;
  background: ${colors.borderLight};
  margin: 4px 2px;
`;

export const StyledCtaChip = styled.button<{ $disabled?: boolean; $dimmed?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${colors.borderLight};
  background: #FBFCFE;
  cursor: ${(p) => (p.$disabled ? 'default' : 'pointer')};
  text-align: left;
  opacity: ${(p) => (p.$dimmed ? 0.7 : 1)};
  filter: none;
  transition: transform 140ms ease, border-color 140ms ease, background 140ms ease, box-shadow 140ms ease, opacity 160ms ease;

  &:hover {
    border-color: ${(p) => (p.$disabled ? colors.borderLight : colors.main)};
    background: ${(p) => (p.$disabled ? '#FBFCFE' : colors.mainSoft)};
    transform: ${(p) => (p.$disabled ? 'none' : 'translateX(2px)')};
    box-shadow: ${(p) => (p.$disabled ? 'none' : '0 4px 12px -4px rgba(44, 129, 252, 0.2)')};
  }

  &:active {
    transform: ${(p) => (p.$disabled ? 'none' : 'translateX(0)')};
  }
`;

export const StyledCtaChipIcon = styled.span`
  font-size: 22px;
  line-height: 1;
  flex-shrink: 0;
`;

export const StyledCtaChipLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;

  strong {
    font-size: 14px;
    font-weight: 700;
    color: ${colors.text};
    letter-spacing: -0.01em;
  }

  span {
    font-size: 13px;
    color: ${colors.textMuted};
    letter-spacing: -0.01em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const StyledCtaChipArrow = styled.span`
  font-size: 16px;
  color: ${colors.textMuted};
  flex-shrink: 0;
  line-height: 1;
`;

// ─── Rich Bubble (장문 답변) ─────────────────
export const StyledRichBubble = styled.div<{ $side: 'ai' | 'user' }>`
  max-width: 92%;
  padding: 14px 16px;
  border-radius: ${(p) => (p.$side === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px')};
  background: ${(p) => (p.$side === 'user' ? colors.userBubble : colors.aiBubble)};
  color: ${(p) => (p.$side === 'user' ? colors.white : colors.text)};
  font-size: 15px;
  line-height: 1.65;
  letter-spacing: -0.01em;
  white-space: pre-wrap;
  word-break: keep-all;
  box-shadow: ${(p) =>
    p.$side === 'ai' ? '0 1px 2px rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(15, 23, 42, 0.04)' : 'none'};

  strong {
    font-weight: 700;
    color: ${colors.text};
  }

  a {
    color: #2563eb;
    font-weight: 500;
    text-decoration: underline;
    text-underline-offset: 2px;
    word-break: break-all;
    transition: color 0.15s ease;

    &:hover {
      color: #1d4ed8;
    }
  }
`;
