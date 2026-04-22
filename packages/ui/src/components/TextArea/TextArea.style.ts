import styled from '@emotion/styled';
import type {
  BorderRadiusKey,
  ColorKey,
  TypographyKey
} from '#styles/emotion.d.ts';
import isPropValid from '@emotion/is-prop-valid';
import type { CSSProperties } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

export interface StyledTextAreaProps {
  $padding?: CSSProperties['padding'];
  $borderRadius?: BorderRadiusKey;
  $borderColor?: ColorKey;
  $bgColor?: ColorKey;
  $typo?: TypographyKey;
  $width?: CSSProperties['width'];
  $placeholderColor?: ColorKey;
}

export const StyledTextArea = styled(TextareaAutosize, {
  shouldForwardProp: (prop) =>
    isPropValid(prop) || prop === 'minRows' || prop === 'maxRows'
})<StyledTextAreaProps>`
  display: flex;
  width: ${({ $width }) => $width ?? '100%'};
  padding: ${({ $padding }) => $padding ?? '10px 16px'};
  align-items: center;
  gap: 10px;
  align-self: stretch;

  border-radius: ${({ $borderRadius, theme }) =>
    $borderRadius ? theme.borderRadius[$borderRadius] : '6px'};
  border: 1px solid
    ${({ $borderColor, theme }) =>
      $borderColor ? theme.color[$borderColor] : theme.color.borderGray};
  background: ${({ $bgColor, theme }) =>
    $bgColor ? theme.color[$bgColor] : theme.color.white};

  &::placeholder {
    color: ${({ theme, $placeholderColor }) =>
      $placeholderColor
        ? theme.color[$placeholderColor]
        : theme.color.textPlaceholder};
  }
  ${({ theme, $typo }) => ($typo ? theme.typo[$typo] : theme.typo.Rg_16)}
`;
