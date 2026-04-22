import styled from '@emotion/styled';

export const StyledPunnelSection = styled.section<{ $isMobile: boolean }>`
  position: absolute;
  ${({ $isMobile }) => ($isMobile ? 'bottom: 24px;' : 'top: 20px;')};
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export const StyledBadgeContainer = styled.div`
  position: relative;
  padding: 1.2px;
  border-radius: 999px;
  background: ${({ theme }) => theme.gradient.blueGlassGradient};
  box-shadow: ${({ theme }) => theme.shadow.modal};
  width: fit-content;
`;

export const StyledBadgeInner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 6px 6px 6px 20px;
  border-radius: 999px;
  background: ${({ theme }) => theme.color.white};
`;

export const StyledBlackText = styled.p`
  color: ${({ theme }) => theme.color.black};
  ${({ theme }) => theme.typo.Md_15};
`;

export const StyledMainText = styled.span`
  color: ${({ theme }) => theme.color.main};
  ${({ theme }) => theme.typo.Md_15};
  font-weight: 900;
`;

export const StyledBadgeText = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;
