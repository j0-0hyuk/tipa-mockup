import styled from '@emotion/styled';

export const StyledTallyWrapper = styled.div`
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
`;

export const StyledTallyDescription = styled.p`
  ${({ theme }) => theme.typo.Rg_15};
  color: ${({ theme }) => theme.color.main};
  text-align: center;
  padding: 16px 0 0 0;
`;