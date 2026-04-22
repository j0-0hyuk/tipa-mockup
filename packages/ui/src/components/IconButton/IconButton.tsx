import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import {
  StyledIconButton,
  type StyledButtonProps,
  type ButtonVariant,
  type ButtonSize
} from '#components/IconButton/IconButton.style.ts';

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    StyledButtonProps {
  children: ReactNode;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = 'filled',
      size = 'medium',
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <StyledIconButton
        ref={ref}
        variant={variant}
        size={size}
        type={type}
        {...props}
      >
        {children}
      </StyledIconButton>
    );
  }
);

IconButton.displayName = 'IconButton';

export { IconButton };
export type { ButtonVariant, ButtonSize };
