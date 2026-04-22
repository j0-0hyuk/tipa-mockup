import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';
import * as ProgressPrimitive from '@radix-ui/react-progress';

interface StyledProgressRootProps {
  height?: number | string;
}

interface StyledProgressIndicatorProps {
  $progress: number;
}

export type StyledProgressProps = StyledProgressRootProps;

export const StyledProgressRoot = styled(
  ProgressPrimitive.Root
)<StyledProgressRootProps>`
  position: relative;
  overflow: hidden;
  height: ${({ height }) =>
    typeof height === 'number' ? `${height}px` : height || '6px'};
  border-radius: 999px;
  background: ${({ theme }) => theme.color.bgBlueGray};
  width: 100%;
  min-width: 0;
  transform: translateZ(0);
`;

export const StyledProgressIndicator = styled(ProgressPrimitive.Indicator, {
  shouldForwardProp: (prop) => isPropValid(prop)
})<StyledProgressIndicatorProps>`
  background: ${({ theme }) => theme.color.main};
  width: 100%;
  height: 100%;
  transition: transform 660ms cubic-bezier(0.65, 0, 0.35, 1);
  transform: ${({ $progress }) => `translateX(-${100 - $progress}%)`};
`;
