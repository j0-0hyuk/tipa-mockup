import {
  StyledButton,
  type StyledButtonProps,
  type ButtonVariant,
  type ButtonSize
} from '#components/Button/Button.style.ts';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    StyledButtonProps {
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'filled',
      size = 'medium',
      width,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <StyledButton
        ref={ref}
        variant={variant}
        size={size}
        width={width}
        type={type}
        {...props}
      >
        {children}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonVariant, ButtonSize };
