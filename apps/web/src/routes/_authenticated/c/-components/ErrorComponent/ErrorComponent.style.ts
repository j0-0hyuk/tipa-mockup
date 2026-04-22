import styled from '@emotion/styled';

export const StyledTitleErrorText = styled.h2`
  color: ${({ theme }) => theme.color.black};
  text-align: center;
  ${({ theme }) => theme.typo.Sb_32}
`;

export const StyledDescriptionError = styled.p`
  text-align: center;
  ${({ theme }) => theme.typo.Md_16}
  color: ${({ theme }) => theme.color.textGray};
`;

export const StyledEmphasize = styled.span`
  color: ${({ theme }) => theme.color.main};
`;
