import {
  StyledRadioButton,
  StyledRadioGroupIndicator,
  type RadioButtonSize
} from '#components/RadioButton/RadioButton.style.ts';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';

export type { RadioButtonSize };

export interface RadioButtonProps extends ComponentPropsWithoutRef<'div'> {
  size?: RadioButtonSize;
}

export const RadioButton = forwardRef<HTMLDivElement, RadioButtonProps>(
  ({ size = 'medium', ...props }, ref) => {
    return (
      <StyledRadioButton ref={ref} $size={size} {...props}>
        <RadioGroupPrimitive.Indicator asChild>
          <StyledRadioGroupIndicator $size={size} />
        </RadioGroupPrimitive.Indicator>
      </StyledRadioButton>
    );
  }
);

RadioButton.displayName = 'RadioButton';
