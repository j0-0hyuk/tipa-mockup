import styled from '@emotion/styled';

export const StyledFileDescription = styled.div<{ $disabled: boolean }>`
  ${({ theme }) => theme.typo.Rg_12}
  color: ${({ theme }) => theme.color.textGray};
  white-space: pre-wrap;
    cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  &:hover {
    opacity: ${({ $disabled }) => ($disabled ? 0.5 : 0.8)};
  }
`;
