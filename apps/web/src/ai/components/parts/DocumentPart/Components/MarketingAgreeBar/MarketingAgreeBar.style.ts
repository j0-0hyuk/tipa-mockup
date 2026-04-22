import styled from '@emotion/styled';

export const StyledMarketingAgreeBar = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  background-color: ${({ theme }) => theme.color.white};
  padding: 7px 8px 7px 16px;
`;

export const StyledMarketingAgreeBarText = styled.span`
  ${({ theme }) => theme.typo.Md_15}
  color: ${({ theme }) => theme.color.black};
`;
