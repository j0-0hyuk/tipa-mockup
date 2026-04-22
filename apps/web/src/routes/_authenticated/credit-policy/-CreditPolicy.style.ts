import styled from '@emotion/styled';

export const StyledCreditPolicyContainer = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: ${({ $isMobile }) => ($isMobile ? '100%' : '1090px')};
  padding-bottom: 40px;
  width: 100%;
`;

export const StyledPlanGuideContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 44px;
  width: 100%;
`;

export const StyledPlanGuideTitle = styled.h2`
  ${({ theme }) => theme.typo.Sb_18}
  color: ${({ theme }) => theme.color.black};
  text-align: start;
  margin: 0;
  width: 100%;
`;

export const StyledPlanGuideDescription = styled.p`
  ${({ theme }) => theme.typo.Rg_16}
  color: ${({ theme }) => theme.color.black};
  text-align: start;
  margin: 0;
  width: 100%;
  white-space: pre-line;
`;

export const StyledPageTitle = styled.h1<{ $isSm?: boolean }>`
  ${({ theme, $isSm }) => ($isSm ? theme.typo.Sb_24 : theme.typo.Sb_32)}
  color: ${({ theme }) => theme.color.black};
  text-align: center;
  margin: 0;
  width: 100%;
`;

export const StyledContentWrapper = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  width: ${({ $isMobile }) => ($isMobile ? '100%' : '880px')};
`;

export const StyledPolicyCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  background: ${({ theme }) => theme.color.white};
`;

export const StyledPolicyQuestion = styled.h3`
  ${({ theme }) => theme.typo.Sb_18}
  color: ${({ theme }) => theme.color.black};
  margin: 0;
  line-height: 20px;
  width: 100%;
`;

export const StyledPolicyAnswer = styled.div`
  ${({ theme }) => theme.typo.Rg_16}
  color: ${({ theme }) => theme.color.black};
  line-height: 28px;
  letter-spacing: -0.02em;
  width: 100%;
`;

export const StyledPolicyTable = styled.div`
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  margin-top: 16px;
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

export const StyledTableCell = styled.div`
  padding: 24px 16px;
  ${({ theme }) => theme.typo.Md_14}
  color: ${({ theme }) => theme.color.bgDarkGray};
  display: flex;
  align-items: center;
  text-align: center;
  &:first-of-type {
    ${({ theme }) => theme.typo.Md_14}
    font-weight: 500;
  }
  white-space: pre;
`;

export const StyledBulletItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
`;

export const StyledBulletIcon = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-top: 2px;
`;

export const StyledBulletText = styled.span`
  ${({ theme }) => theme.typo.Rg_16}
  color: ${({ theme }) => theme.color.black};
  line-height: 28px;
  letter-spacing: -0.02em;
`;

export const StyledNestedBulletItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  padding-left: 24px;
`;
