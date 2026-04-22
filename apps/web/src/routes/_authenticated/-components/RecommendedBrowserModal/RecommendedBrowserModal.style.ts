import styled from '@emotion/styled';

export const StyledContentText = styled.p`
  color: ${({ theme }) => theme.color.textPrimary};
  ${({ theme }) => theme.typo.Rg_16}
`;

export const StyledEmphasize = styled.strong`
  ${({ theme }) => theme.typo.Sb_16}
`;

export const StyledChromeLink = styled.a`
  display: inline-block;
  margin-top: 8px;
  color: ${({ theme }) => theme.color.main};
  ${({ theme }) => theme.typo.Md_14}
  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.color.main};
    opacity: 0.9;
  }
`;
