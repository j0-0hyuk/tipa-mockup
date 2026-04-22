import type {
  BorderRadiusKey,
  ColorKey,
  TypographyKey
} from '#styles/emotion.d.ts';
import type { Theme } from '@emotion/react';
import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';

export interface StyledBadgeProps {
  padding?: number | string;
  $bgColor?: ColorKey | string;
  $color?: ColorKey | string;
  $borderRadius?: BorderRadiusKey | string;
  $typo?: TypographyKey;
}

const resolveColor = (
  theme: Theme,
  color: ColorKey | string | undefined,
  fallback: ColorKey
) => {
  if (!color) {
    return theme.color[fallback];
  }

  if (typeof color === 'string' && color in theme.color) {
    return theme.color[color as ColorKey];
  }

  return color;
};

export const StyledBadge = styled('div', {
  shouldForwardProp: isPropValid
})<StyledBadgeProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  height: fit-content;
  padding: ${({ padding }) =>
    typeof padding === 'number' ? `${padding}px` : padding || '4px 10px'};
  border-radius: ${({ theme, $borderRadius }) =>
    typeof $borderRadius === 'string'
      ? $borderRadius
      : $borderRadius
        ? theme.borderRadius[$borderRadius]
        : '19px'};
  background: ${({ theme, $bgColor }) => resolveColor(theme, $bgColor, 'bgMain')};
  color: ${({ theme, $color }) => resolveColor(theme, $color, 'main')};
  ${({ theme, $typo }) => ($typo ? theme.typo[$typo] : theme.typo.Md_14)};
  white-space: nowrap;
`;

