import styled from '@emotion/styled';
import type { CSSProperties } from 'react';

export interface StyledSkeletonProps {
  width?: CSSProperties['width'];
  minWidth?: CSSProperties['minWidth'];
  maxWidth?: CSSProperties['maxWidth'];
  height?: CSSProperties['height'];
  minHeight?: CSSProperties['minHeight'];
  maxHeight?: CSSProperties['maxHeight'];
}

export const StyledSkeleton = styled.span<StyledSkeletonProps>`
  width: ${({ width }) => width ?? 'auto'};
  min-width: ${({ minWidth }) => minWidth ?? 'auto'};
  max-width: ${({ maxWidth }) => maxWidth ?? 'auto'};
  height: ${({ height }) => height ?? 'auto'};
  min-height: ${({ minHeight }) => minHeight ?? 'auto'};
  max-height: ${({ maxHeight }) => maxHeight ?? 'auto'};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  animation: rt-skeleton-pulse 1000ms infinite alternate-reverse !important;
  background-image: none !important;
  background-clip: border-box !important;
  border: none !important;
  box-shadow: none !important;
  box-decoration-break: clone !important;
  color: transparent !important;
  outline: none !important;
  pointer-events: none !important;
  user-select: none !important;
  cursor: default !important;

  &:where([data-inline-skeleton]) {
    line-height: 0;
    font-family: Arial, sans-serif !important;
  }

  &:where(&:empty) {
    display: block;
  }

  & > *,
  &::after,
  &::before {
    visibility: hidden !important;
  }

  @keyframes rt-skeleton-pulse {
    from {
      background-color: ${({ theme }) => theme.color.bgBlueGray};
    }
    to {
      background-color: ${({ theme }) => theme.color.borderGray};
    }
  }
`;
