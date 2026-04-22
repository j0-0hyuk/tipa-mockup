import type { ColorKey, TypographyKey } from '#styles/emotion.d.ts';
import type { Theme } from '@emotion/react';
import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';

export interface StyledCalloutProps {
  $variant?: 'info' | 'warning' | 'error';
  $typo?: TypographyKey;
}

const variantMap: Record<
  'info' | 'warning' | 'error',
  { bg: ColorKey; color: ColorKey; border: ColorKey }
> = {
  info: { bg: 'bgLightGray', color: 'textGray', border: 'borderLightGray' },
  warning: { bg: 'bgMain', color: 'main', border: 'borderLightGray' },
  error: { bg: 'errorBg', color: 'error', border: 'errorBg' }
};

const variantStyles = (theme: Theme, variant: 'info' | 'warning' | 'error') => {
  const tokens = variantMap[variant];

  return `
    background: ${theme.color[tokens.bg]};
    color: ${theme.color[tokens.color]};
    border: 1px solid ${theme.color[tokens.border]};
  `;
};

export const StyledCallout = styled('div', {
  shouldForwardProp: isPropValid
})<StyledCalloutProps>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  ${({ theme, $typo }) => ($typo ? theme.typo[$typo] : theme.typo.Rg_14)};
  ${({ theme, $variant = 'info' }) => variantStyles(theme, $variant)};

  & > svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
`;
