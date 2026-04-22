import styled from '@emotion/styled';

export const StyledMainText = styled.div`
  color: ${({ theme }) => theme.color.black};
  text-align: center;
  ${({ theme }) => theme.typo.Sb_32}
`;

export const StyledSubText = styled.div`
  color: ${({ theme }) => theme.color.textGray};
  text-align: center;
  ${({ theme }) => theme.typo.Md_16}
`;

export const StyledContactText = styled.div`
  color: ${({ theme }) => theme.color.textGray};
  text-align: center;
  ${({ theme }) => theme.typo.Rg_15}
`;
