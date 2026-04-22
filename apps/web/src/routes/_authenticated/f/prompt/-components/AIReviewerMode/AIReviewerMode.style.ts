import styled from '@emotion/styled';
import { colors } from '@bichon/ds';

export const StyledFieldBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 40px;
  width: 100%;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

export const StyledFieldLabel = styled.label`
  ${({ theme }) => theme.typo.Md_16}
  color: ${colors.textPrimary};
  margin-bottom: 8px;
  display: block;
  width: 100%;
`;

export const StyledFieldMetaRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-top: 4px;
  width: 100%;
`;

export const StyledFieldError = styled.span`
  ${({ theme }) => theme.typo.Md_12}
  color: ${colors.textWarning};
  display: block;
  flex: 1;
`;

export const StyledAIButtonWrapper = styled.div`
  margin-left: auto;
  display: inline-flex;
  flex-shrink: 0;
`;
