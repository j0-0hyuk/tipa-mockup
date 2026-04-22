import styled from '@emotion/styled';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import isPropValid from '@emotion/is-prop-valid';
import type { BorderRadiusKey } from '#styles/emotion.d.ts';

export interface StyledAvatarRootProps {
  $size?: string | number;
  $borderRadius?: BorderRadiusKey;
}

export const StyledAvatarRoot = styled(AvatarPrimitive.Root, {
  shouldForwardProp: isPropValid
})<StyledAvatarRootProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  overflow: hidden;
  user-select: none;
  width: ${({ $size }) =>
    typeof $size === 'number' ? `${$size}px` : $size || '40px'};
  height: ${({ $size }) =>
    typeof $size === 'number' ? `${$size}px` : $size || '40px'};
  border-radius: ${({ $borderRadius, theme }) =>
    $borderRadius ? theme.borderRadius[$borderRadius] : '100%'};
  background-color: ${({ theme }) => theme.color.bgGray};
`;

export const StyledAvatarImage = styled(AvatarPrimitive.Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
`;

export const StyledAvatarFallback = styled(AvatarPrimitive.Fallback)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
  background: #dbdbdb;
`;
