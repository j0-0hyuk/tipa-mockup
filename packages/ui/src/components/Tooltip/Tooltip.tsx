import * as RToolTip from '@radix-ui/react-tooltip';
import type { PropsWithChildren } from 'react';
import {
  StyledTooltipArrow,
  StyledTooltipContent
} from '#components/Tooltip/Tooltip.style.ts';

export interface TooltipProps extends PropsWithChildren {
  content?: string | null;
  side?: 'top' | 'right' | 'bottom' | 'left';
  placement?: number;
}

export const Tooltip = ({
  content,
  children,
  side = 'right',
  placement = 5
}: TooltipProps) => {
  if (!content) {
    return <>{children}</>;
  }

  return (
    <RToolTip.Provider delayDuration={0}>
      <RToolTip.Root>
        <RToolTip.Trigger asChild>{children}</RToolTip.Trigger>
        <RToolTip.Portal>
          <StyledTooltipContent side={side} sideOffset={placement}>
            {content}
            <StyledTooltipArrow />
          </StyledTooltipContent>
        </RToolTip.Portal>
      </RToolTip.Root>
    </RToolTip.Provider>
  );
};
