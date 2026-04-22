import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import {
  StyledBadge,
  type StyledBadgeProps
} from '#components/Badge/Badge.style.ts';

export type BadgeProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  StyledBadgeProps;

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ children, ...props }, ref) => {
    return (
      <StyledBadge ref={ref} {...props}>
        {children}
      </StyledBadge>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };

