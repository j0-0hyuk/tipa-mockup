import styled from '@emotion/styled';

export const StyledHwpGuide = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  ${({ theme }) => theme.typo.Rg_14};
  color: ${({ theme }) => theme.color.textGray};
  width: 100%;
  text-align: end;
  cursor: pointer;
`;

export const StyledHwpGuideDialogFooter = styled.p`
  width: 100%;
  max-width: 360px;
  ${({ theme }) => theme.typo.Rg_12};
  color: ${({ theme }) => theme.color.textGray};
  margin: 0;
  white-space: pre-wrap;
`;
