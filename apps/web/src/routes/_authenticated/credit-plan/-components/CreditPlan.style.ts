import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';

export const StyledPageContainer = styled.div<{ $isMobile: boolean }>`
  background: ${({ theme }) => theme.color.white};
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  width: 100%;
  padding: ${({ $isMobile }) => ($isMobile ? '0px' : '64px 0')};
`;

export const StyledTabContainer = styled.div<{ $isMobile: boolean }>`
  position: ${({ $isMobile }) => ($isMobile ? 'sticky' : 'static')};
  top: 0;
  z-index: 10;
  height: 48px;
  background: ${({ theme }) => theme.color.white};
  border-bottom: 1px solid ${({ theme }) => theme.color.borderGray};
  display: flex;
  align-items: start;
  justify-content: start;
  width: ${({ $isMobile }) => ($isMobile ? '100%' : '920px')};
  padding: 0 24px;
`;

export const StyledTabLink = styled.div<{ $isActive: boolean }>`
  position: relative;
  height: 48px;
  padding: 16px;
  background: none;
  cursor: pointer;
  display: flex;
  gap: 4px;
  text-decoration: none;
  ${({ theme }) => theme.typo.Sb_16}
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.color.black : theme.color.textGray};

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;

export const StyledTabIndicator = styled.div`
  position: absolute;
  bottom: -1px;
  left: 14px;
  right: 14px;
  height: 2px;
  background: ${({ theme }) => theme.color.black};
  border-radius: 100px;
`;

export const StyledContentContainer = styled.section<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: ${({ $isMobile }) =>
    $isMobile ? '40px 16px 24px 16px' : '40px 0px 40px 0px'};
  width: ${({ $isMobile }) => ($isMobile ? '100%' : '920px')};
`;

export const StyledPageTitle = styled.h1<{ $isMobile: boolean }>`
  ${({ theme, $isMobile }) => ($isMobile ? theme.typo.Sb_24 : theme.typo.Sb_32)}
  color: ${({ theme }) => theme.color.black};
  text-align: center;
  margin: 0;
`;

export const StyledSection = styled.div<{ $isMobile: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? '100%' : '880px')};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StyledSectionTitle = styled.h2`
  ${({ theme }) => theme.typo.Md_15}
  color: ${({ theme }) => theme.color.black};
  margin: 0;
`;

export const StyledCreditCard = styled.div<{ $isSm: boolean }>`
  background: ${({ theme }) => theme.color.white};
  border: 1.5px solid ${({ theme }) => theme.color.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 30px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StyledCreditInfo = styled.div<{ $isSm: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  ${({ theme }) => theme.typo.Md_15}
  color: ${({ theme }) => theme.color.black};
`;

export const StyledCreditAmount = styled.span`
  color: ${({ theme }) => theme.color.main};
`;

export const StyledCreditButton = styled.button<{ $isSm: boolean }>`
  background: ${({ theme }) => theme.color.main};
  color: ${({ theme }) => theme.color.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ $isSm }) => ($isSm ? '8px 16px' : '10.5px 24px')};
  cursor: pointer;
  ${({ $isSm, theme }) => ($isSm ? theme.typo.Md_15 : theme.typo.Md_16)}

  &:hover {
    opacity: 0.9;
  }
`;

export const StyledCreditDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StyledCreditDetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  ${({ theme }) => theme.typo.Rg_15}
  color: ${({ theme }) => theme.color.black};
`;

export const StyledIconContainer = styled.div`
  width: 24px;
  height: 24px;
  background: #f1f1f4;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledPlanCard = styled.div<{ $isSm: boolean }>`
  background: ${({ theme }) => theme.color.white};
  border: 1.5px solid ${({ theme }) => theme.color.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StyledPlanTitle = styled.h3<{ $isSm: boolean }>`
  ${({ theme }) => theme.typo.Md_15}
  color: ${({ theme }) => theme.color.black};
  margin: 0;
`;

export const StyledPlanButton = styled.button<{ $isSm: boolean }>`
  background: ${({ theme }) => theme.color.main};
  color: ${({ theme }) => theme.color.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ $isSm }) => ($isSm ? '8px 16px' : '10.5px 24px')};
  cursor: pointer;
  ${({ $isSm, theme }) => ($isSm ? theme.typo.Md_15 : theme.typo.Md_16)}

  &:hover {
    opacity: 0.9;
  }
`;

export const StyledFeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StyledFeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const StyledCheckIcon = styled.div`
  width: 24px;
  height: 24px;
  background: ${({ theme }) => theme.color.bgBlueGray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.color.main};
  font-size: 14px;
  font-weight: 600;
`;

export const StyledFeatureText = styled.span`
  ${({ theme }) => theme.typo.Rg_15}
  color: ${({ theme }) => theme.color.black};
`;

export const StyledPlanMeta = styled.div<{ $isSm: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $isSm }) => ($isSm ? 'flex-start' : 'flex-end')};
  justify-content: space-between;
  gap: 8px;
  width: 300px;
`;

export const StyledNextBilling = styled.div<{ $isSm: boolean }>`
  ${({ theme }) => theme.typo.Md_14}
  color: ${({ theme }) => theme.color.textGray};
  text-align: ${({ $isSm }) => ($isSm ? 'center' : 'right')};
`;

export const StyledSubscriptionButton = styled.button<{ $isSm?: boolean }>`
  background: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ $isSm }) => ($isSm ? '9.5px 16px' : '10.5px 24px')};
  cursor: pointer;
  ${({ theme }) => theme.typo.Md_14}
  color: ${({ theme }) => theme.color.black};

  &:hover {
    background: ${({ theme }) => theme.color.bgGray};
  }
`;

export const StyledDivider = styled.div<{ $isMobile: boolean }>`
  width: 100%;
  height: 1px;
  margin: ${({ $isMobile }) => ($isMobile ? '0' : '16px 0')};
  background: ${({ theme }) => theme.color.borderGray};
`;

export const StyledPaymentTable = styled.div`
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
`;

export const StyledTableHeader = styled.div`
  background: ${({ theme }) => theme.color.bgGray};
  border-bottom: 1px solid ${({ theme }) => theme.color.bgBlueGray};
  display: flex;
  height: 40px;
  align-items: center;
`;

export const StyledTableRow = styled.div`
  background: ${({ theme }) => theme.color.white};
  border-bottom: 1px solid ${({ theme }) => theme.color.bgBlueGray};
  display: flex;
  height: 64px;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

export const StyledTableCell = styled.div<{ $isSm?: boolean }>`
  padding: ${({ $isSm }) => ($isSm ? '11px 12px' : '24px 16px')};
  ${({ theme, $isSm }) => ($isSm ? theme.typo.Rg_13 : theme.typo.Md_14)}
  color: ${({ theme }) => theme.color.bgDarkGray};
  display: flex;
  align-items: center;
`;

export const StyledReceiptButton = styled.button<{ $isSm?: boolean }>`
  background: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ $isSm }) => ($isSm ? '4px 8px' : '8px 16px')};
  height: 32px;
  cursor: pointer;
  ${({ theme }) => theme.typo.Md_12}
  color: ${({ theme }) => theme.color.textGray};
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: ${({ theme }) => theme.color.bgGray};
  }
`;

export const StyledCreditDescription = styled.span`
  width: 100%;
  white-space: pre-line;
  ${({ theme }) => theme.typo.Rg_14}
  color: ${({ theme }) => theme.color.textGray};
`;

export const StyledCreditDetailLink = styled(Link)`
  ${({ theme }) => theme.typo.Rg_14}
  color: ${({ theme }) => theme.color.textGray};
  text-decoration: underline;
  cursor: pointer;
`;

export const StyledProgressWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  > div:first-of-type {
    background-color: ${({ theme }) => theme.color.bgMediumGray} !important;
  }
`;

export const StyledProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 60%;
`;

export const StyledProgressPercentage = styled.span`
  ${({ theme }) => theme.typo.Md_15}
  color: ${({ theme }) => theme.color.black};
  white-space: nowrap;
`;

export const StyledResetTimeContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledResetTimeText = styled.span`
  ${({ theme }) => theme.typo.Md_15}
  color: ${({ theme }) => theme.color.black};
`;
