import styled from '@emotion/styled';
import isPropValid from '@emotion/is-prop-valid';
import type { CSSProperties } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

export type TextFieldVariant = 'default' | 'focus' | 'warning' | 'disabled';

export interface StyledTextFieldProps {
  $variant?: TextFieldVariant;
  $width?: CSSProperties['width'];
  $multiline?: boolean;
}

export interface StyledHelperTextProps {
  $variant?: TextFieldVariant;
}

/**
 * TextField의 기본 input/textarea 스타일 컴포넌트
 * multiline이 true일 때는 TextareaAutosize를 사용하여 자동 높이 조절
 */
export const StyledTextFieldInput = styled.input<StyledTextFieldProps>`
  width: 100%;
  padding: 12.5px 16px;
  border: 1px solid
    ${({ theme, $variant }) => {
      if ($variant === 'focus') return theme.color.lineAccent;
      if ($variant === 'warning') return theme.color.lineWarning;
      return theme.color.lineDefault;
    }};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ theme }) => theme.color.white};
  color: ${({ theme }) => theme.color.textPrimary};
  ${({ theme }) => theme.typo.Rg_16};
  opacity: ${({ $variant }) => ($variant === 'disabled' ? 0.5 : 1)};

  &::placeholder {
    color: ${({ theme }) => theme.color.textPlaceholder};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme, $variant }) => {
      if ($variant === 'warning') return theme.color.lineWarning;
      return theme.color.lineAccent;
    }};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const StyledTextFieldTextarea = styled(TextareaAutosize, {
  shouldForwardProp: (prop) =>
    isPropValid(prop) || prop === 'minRows' || prop === 'maxRows'
})<StyledTextFieldProps>`
  width: 100%;
  padding: 12.5px 16px;
  border: 1px solid
    ${({ theme, $variant }) => {
      if ($variant === 'focus') return theme.color.lineAccent;
      if ($variant === 'warning') return theme.color.lineWarning;
      return theme.color.lineDefault;
    }};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ theme }) => theme.color.white};
  color: ${({ theme }) => theme.color.textPrimary};
  ${({ theme }) => theme.typo.Rg_16};
  opacity: ${({ $variant }) => ($variant === 'disabled' ? 0.5 : 1)};
  resize: none;
  font-family: inherit;

  &::placeholder {
    color: ${({ theme }) => theme.color.textPlaceholder};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme, $variant }) => {
      if ($variant === 'warning') return theme.color.lineWarning;
      return theme.color.lineAccent;
    }};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

/**
 * Helper Text 스타일 컴포넌트
 * variant에 따라 색상이 변경되며, disabled일 때는 opacity 50% 적용
 */
export const StyledHelperText = styled.div<StyledHelperTextProps>`
  ${({ theme }) => theme.typo.Rg_12}
  margin-top: 6px;
  color: ${({ theme, $variant }) => {
    if ($variant === 'warning') return theme.color.textWarning;
    return theme.color.textTertiary;
  }};
  opacity: ${({ $variant }) => ($variant === 'disabled' ? 0.5 : 1)};
`;
