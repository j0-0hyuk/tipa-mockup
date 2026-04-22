import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import {
  StyledCallout,
  type StyledCalloutProps
} from '#components/Callout/Callout.style.ts';
import { Info, AlertTriangle, AlertCircle } from 'lucide-react';

export type CalloutProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  StyledCalloutProps & {
    icon?: ReactNode;
  };

const defaultIcons: Record<string, ReactNode> = {
  info: <Info size={16} />,
  warning: <AlertTriangle size={16} />,
  error: <AlertCircle size={16} />
};

const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  ({ children, icon, $variant = 'info', ...props }, ref) => {
    const resolvedIcon = icon ?? defaultIcons[$variant];

    return (
      <StyledCallout ref={ref} $variant={$variant} {...props}>
        {resolvedIcon}
        {children}
      </StyledCallout>
    );
  }
);

Callout.displayName = 'Callout';

export { Callout };
