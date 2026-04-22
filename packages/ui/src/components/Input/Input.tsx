import { forwardRef, type InputHTMLAttributes } from 'react';

import { useTheme } from '@emotion/react';

import {
  StyledInput,
  StyledInputWrapper
} from '#components/Input/Input.style.ts';

export type InputProps = React.DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  height?: number | string;
  width?: number | string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ disabled, height, width, children, ...props }, ref) => {
    const theme = useTheme();
    const invalid = props['aria-invalid'];

    return (
      <StyledInputWrapper
        borderColor={invalid ? '#D93025' : theme.color.borderGray}
        height={height}
        width={width}
        disabled={disabled}
      >
        <StyledInput
          disabled={disabled}
          autoComplete="on"
          {...props}
          ref={ref}
        />
        {children}
      </StyledInputWrapper>
    );
  }
);

Input.displayName = 'Input';

export { Input };
