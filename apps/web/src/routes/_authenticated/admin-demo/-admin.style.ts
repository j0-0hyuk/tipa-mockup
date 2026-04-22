import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

/* ─── Colors (start2와 통일) ─── */
export const colors = {
  main: '#2C81FC',
  text: '#25262C',
  textMuted: '#6E7687',
  textLight: '#B5B9C4',
  border: '#E3E4E8',
  borderLight: '#EEF0F4',
  bg: '#FAFAFC',
  bgHighlight: '#F0F6FF',
  success: '#22C55E',
  warn: '#F59E0B',
  danger: '#EF4444',
} as const;

/* ─── Layout ─── */
export const StyledAdminRoot = styled.div`
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  background: #FFFFFF;
`;

export const StyledAdminNav = styled.aside`
  width: 220px;
  flex-shrink: 0;
  border-right: 1px solid ${colors.borderLight};
  padding: 24px 12px;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StyledAdminNavHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 12px 20px;
  border-bottom: 1px solid ${colors.borderLight};
  margin-bottom: 12px;
  color: ${colors.text};
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.02em;
`;

export const StyledAdminNavItem = styled.button<{ $active?: boolean }>`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  color: ${({ $active }) => ($active ? colors.main : colors.text)};
  background: ${({ $active }) => ($active ? colors.bgHighlight : 'transparent')};
  letter-spacing: -0.02em;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ $active }) => ($active ? colors.bgHighlight : colors.bg)};
  }
`;

export const StyledAdminMain = styled.main`
  flex: 1;
  min-width: 0;
  padding: 40px 48px 80px;
  overflow-y: auto;
  background: #FFFFFF;
`;

export const StyledAdminHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

export const StyledAdminTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: ${colors.text};
  letter-spacing: -0.02em;
  margin: 0;
`;

export const StyledAdminSubtitle = styled.p`
  font-size: 14px;
  color: ${colors.textMuted};
  letter-spacing: -0.02em;
  margin: 4px 0 0;
`;

export const StyledOperatorBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid ${colors.border};
  font-size: 13px;
  font-weight: 500;
  color: ${colors.text};
  background: ${colors.bg};
  letter-spacing: -0.02em;
`;

/* ─── KPI Cards ─── */
export const StyledKpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
`;

export const StyledKpiCard = styled.div`
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: 24px;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StyledKpiLabel = styled.div`
  font-size: 13px;
  color: ${colors.textMuted};
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StyledKpiValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${colors.text};
  letter-spacing: -0.03em;
`;

export const StyledKpiSub = styled.div<{ $positive?: boolean }>`
  font-size: 12px;
  color: ${({ $positive }) => ($positive === undefined ? colors.textMuted : $positive ? colors.success : colors.danger)};
  letter-spacing: -0.02em;
`;

/* ─── Pulse dot for live status ─── */
const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
`;

export const StyledLiveDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${colors.success};
  animation: ${pulse} 1.6s ease-in-out infinite;
`;

/* ─── Card / Section ─── */
export const StyledCard = styled.div`
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: 24px;
  background: #FFFFFF;
`;

export const StyledCardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.text};
  letter-spacing: -0.02em;
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const StyledSectionGrid = styled.div<{ $cols?: number }>`
  display: grid;
  grid-template-columns: ${({ $cols = 2 }) => `repeat(${$cols}, 1fr)`};
  gap: 16px;
  margin-bottom: 24px;
`;

/* ─── Table ─── */
export const StyledTableWrapper = styled.div`
  border: 1px solid ${colors.border};
  border-radius: 12px;
  overflow: hidden;
  background: #FFFFFF;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  color: ${colors.text};
  letter-spacing: -0.02em;

  thead tr {
    background: ${colors.bg};
    border-bottom: 1px solid ${colors.borderLight};
  }
  th {
    text-align: left;
    padding: 14px 16px;
    font-weight: 600;
    color: ${colors.textMuted};
    font-size: 12px;
    letter-spacing: -0.01em;
  }
  tbody tr {
    border-bottom: 1px solid ${colors.borderLight};
    cursor: pointer;
    transition: background 0.15s ease;
  }
  tbody tr:hover {
    background: ${colors.bg};
  }
  tbody tr:last-child {
    border-bottom: none;
  }
  td {
    padding: 14px 16px;
    vertical-align: middle;
  }
`;

/* ─── Badges ─── */
export const StyledBadge = styled.span<{ $variant?: 'success' | 'warn' | 'danger' | 'info' | 'neutral' }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: -0.01em;
  background: ${({ $variant = 'neutral' }) => {
    switch ($variant) {
      case 'success': return '#E8F7EE';
      case 'warn': return '#FEF4E6';
      case 'danger': return '#FDECEC';
      case 'info': return colors.bgHighlight;
      default: return colors.bg;
    }
  }};
  color: ${({ $variant = 'neutral' }) => {
    switch ($variant) {
      case 'success': return '#16A34A';
      case 'warn': return '#D97706';
      case 'danger': return '#DC2626';
      case 'info': return colors.main;
      default: return colors.textMuted;
    }
  }};
`;

/* ─── Filter bar ─── */
export const StyledFilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

export const StyledFilterSelect = styled.select`
  height: 36px;
  padding: 0 32px 0 14px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  font-size: 13px;
  color: ${colors.text};
  background: #FFFFFF url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="%236E7687" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>') no-repeat right 12px center;
  appearance: none;
  letter-spacing: -0.02em;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: ${colors.main};
  }
`;

export const StyledSearchInput = styled.input`
  height: 36px;
  padding: 0 14px 0 36px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  font-size: 13px;
  color: ${colors.text};
  background: #FFFFFF url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="%236E7687" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>') no-repeat 12px center;
  width: 260px;
  letter-spacing: -0.02em;
  &::placeholder {
    color: ${colors.textLight};
  }
  &:focus {
    outline: none;
    border-color: ${colors.main};
  }
`;

/* ─── Progress bar ─── */
export const StyledProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${colors.bg};
  border-radius: 999px;
  overflow: hidden;
`;

export const StyledProgressFill = styled.div<{ $pct: number; $color?: string }>`
  width: ${({ $pct }) => `${Math.min(100, Math.max(0, $pct))}%`};
  height: 100%;
  background: ${({ $color }) => $color || colors.main};
  transition: width 0.3s ease;
`;

/* ─── Detail page ─── */
export const StyledBackLink = styled.button`
  all: unset;
  cursor: pointer;
  font-size: 13px;
  color: ${colors.textMuted};
  letter-spacing: -0.02em;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
  &:hover {
    color: ${colors.main};
  }
`;

export const StyledProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  border: 1px solid ${colors.border};
  border-radius: 12px;
  margin-bottom: 24px;
  background: #FFFFFF;
`;

export const StyledAvatar = styled.div<{ $color?: string }>`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ $color }) => $color || '#E0EBFF'};
  color: ${colors.main};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  flex-shrink: 0;
`;

export const StyledProfileInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const StyledProfileName = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.text};
  letter-spacing: -0.02em;
`;

export const StyledProfileMeta = styled.div`
  font-size: 13px;
  color: ${colors.textMuted};
  letter-spacing: -0.02em;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

/* ─── Timeline ─── */
export const StyledTimeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const StyledTimelineItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  font-size: 13px;
  color: ${colors.text};
  letter-spacing: -0.02em;
`;

export const StyledTimelineDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${colors.main};
  margin-top: 5px;
  flex-shrink: 0;
`;

export const StyledTimelineTime = styled.div`
  color: ${colors.textLight};
  font-size: 12px;
  margin-top: 2px;
`;
