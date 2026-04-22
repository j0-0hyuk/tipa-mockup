import styled from '@emotion/styled';

export const StyledContainer = styled.div`
  position: relative;
  padding: 1.2px;
  border-radius: 12px;
  background: ${({ theme }) => theme.gradient.blueGlassGradient};
  max-width: 448px;
`;

export const StyledInnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 16px;
  border-radius: 10px;
  background: ${({ theme }) => theme.color.white};
`;

export const StyledTitle = styled.div`
  ${({ theme }) => theme.typo.Sb_18}
  color: ${({ theme }) => theme.color.black};
  text-align: center;
`;

export const StyledDescription = styled.div`
  ${({ theme }) => theme.typo.Rg_16}
  color: ${({ theme }) => theme.color.black};
  white-space: pre-line;
  text-align: center;
`;

export const StyledSubTitle = styled.p`
  ${({ theme }) => theme.typo.Sb_18}
`;
