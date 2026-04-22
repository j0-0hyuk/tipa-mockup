import styled from '@emotion/styled';

export const StyledAlertDialogTitle = styled.h2`
  display: flex;
  flex: 1;
  color: ${({ theme }) => theme.color.black};
  ${({ theme }) => theme.typo.Sb_24}
`;

export const StyledSupportingText = styled.p`
  color: ${({ theme }) => theme.color.black};
  ${({ theme }) => theme.typo.Rg_16}
`;

export const StyledEmphasize = styled.span`
  color: ${({ theme }) => theme.color.main};
  ${({ theme }) => theme.typo.Sb_16}
`;

export const StyledError = styled.span`
  color: ${({ theme }) => theme.color.error};
  ${({ theme }) => theme.typo.Sb_16}
`;
