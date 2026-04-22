import styled from '@emotion/styled';

export const StyledMain = styled.main<{ $isMobile: boolean }>`
  position: relative;
  width: ${({ $isMobile }) => ($isMobile ? '100%' : '768px')};
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: ${({ $isMobile }) => ($isMobile ? '0 16px' : '0px')};
`;

export const StyledMainTitle = styled.h1<{ $sm: boolean }>`
  color: ${({ theme }) => theme.color.black};
  font-weight: 600;
  font-size: ${({ $sm }) => ($sm ? '24px' : '32px')};
  line-height: ${({ $sm }) => ($sm ? '32px' : '42px')};
  letter-spacing: 0%;
  text-align: center;
  white-space: pre-line;
`;

export const StyledRecentDraftTitle = styled.h2`
  top: 0;
  ${({ theme }) => theme.typo.Md_15};
  width: 100%;
  text-align: left;
  margin-bottom: 16px;
`;

// deprecated
// export const StyledMainCallout = styled.div<{ $sm: boolean }>`
//   padding: 12px 14px;
//   border-radius: 8px;
//   background-color: ${({ theme }) => theme.color.bgGray};
//   color: ${({ theme }) => theme.color.textGray};
//   text-align: start;
//   width: 100%;
//   height: fit-content;
//   white-space: pre-line;
//   ${({ theme, $sm }) => ($sm ? theme.typo.Rg_12 : theme.typo.Md_15)};
// `;

// export const StyledDetailDescription = styled.p`
//   color: ${({ theme }) => theme.color.textGray};
//   ${({ theme }) => theme.typo.Md_16};
// `;

// export const StyleDetailBadge = styled.a`
//   display: flex;
//   align-items: center;
//   gap: 4px;
//   padding: 6.5px 12px;
//   background-color: ${({ theme }) => theme.color.white};
//   color: ${({ theme }) => theme.color.bgDarkGray};
//   border: 1px solid ${({ theme }) => theme.color.borderGray};
//   border-radius: 999px;
//   cursor: pointer;
// `;
