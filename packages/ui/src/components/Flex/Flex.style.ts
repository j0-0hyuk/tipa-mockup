import { type CSSProperties } from 'react';

import styled from '@emotion/styled';
import type {
  BorderRadiusKey,
  ColorKey,
  TypographyKey
} from '#styles/emotion.d.ts';

export type SemanticTag =
  | 'nav'
  | 'header'
  | 'footer'
  | 'main'
  | 'section'
  | 'article'
  | 'aside';

export interface StyledFlexProps {
  direction?: CSSProperties['flexDirection'];
  justify?: CSSProperties['justifyContent'];
  alignItems?: CSSProperties['alignItems'];
  alignSelf?: CSSProperties['alignSelf'];
  margin?: CSSProperties['margin'];
  gap?: number | string;
  wrap?: CSSProperties['flexWrap'];
  width?: string | number;
  height?: string | number;
  padding?: CSSProperties['padding'];
  flex?: CSSProperties['flex'];
  grow?: number;
  shrink?: number;
  basis?: string | number;
  $bgColor?: ColorKey;
  $borderRadius?: BorderRadiusKey;
  $borderColor?: ColorKey;
  boxShadow?: CSSProperties['boxShadow'];
  $typo?: TypographyKey;
  $color?: ColorKey;
  minWidth?: CSSProperties['minWidth'];
  maxWidth?: CSSProperties['maxWidth'];
  minHeight?: CSSProperties['minHeight'];
  maxHeight?: CSSProperties['maxHeight'];
  semantic?: SemanticTag;
}

export const StyledFlex = styled.div<StyledFlexProps>`
  display: flex;
  flex-direction: ${({ direction }) => direction || 'row'};
  justify-content: ${({ justify }) => justify || 'flex-start'};
  align-items: ${({ alignItems }) => alignItems || 'stretch'};
  align-self: ${({ alignSelf }) => alignSelf || 'auto'};
  min-width: ${({ minWidth }) => minWidth || 'auto'};
  max-width: ${({ maxWidth }) => maxWidth || 'auto'};
  min-height: ${({ minHeight }) => minHeight || 'auto'};
  max-height: ${({ maxHeight }) => maxHeight || 'auto'};
  gap: ${({ gap }) => (typeof gap === 'number' ? `${gap}px` : gap || '0')};
  flex-wrap: ${({ wrap }) => wrap || 'nowrap'};
  width: ${({ width }) =>
    typeof width === 'number' ? `${width}px` : width || 'auto'};
  height: ${({ height }) =>
    typeof height === 'number' ? `${height}px` : height || 'auto'};
  padding: ${({ padding }) =>
    typeof padding === 'number' ? `${padding}px` : padding || '0'};
  margin: ${({ margin }) =>
    typeof margin === 'number' ? `${margin}px` : margin || '0'};

  ${({ flex, grow, shrink, basis }) =>
    flex
      ? `flex: ${flex};`
      : `
    flex-grow: ${grow ?? 0};
    flex-shrink: ${shrink ?? 1};
    flex-basis: ${
      typeof basis === 'number'
        ? `${basis}px`
        : basis !== undefined
          ? basis
          : 'auto'
    };
  `}
  background-color: ${({ $bgColor, theme }) =>
    $bgColor ? theme.color[$bgColor] : 'transparent'};
  border-radius: ${({ $borderRadius, theme }) =>
    $borderRadius ? theme.borderRadius[$borderRadius] : '0'};
  border: 1px solid
    ${({ $borderColor, theme }) =>
      $borderColor ? theme.color[$borderColor] : 'transparent'};
  box-shadow: ${({ boxShadow }) => boxShadow || 'none'};
  color: ${({ $color, theme }) => ($color ? theme.color[$color] : 'inherit')};
  ${({ theme, $typo }) => $typo && theme.typo[$typo]}
`;
