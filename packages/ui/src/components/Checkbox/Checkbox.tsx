import { useTheme } from '@emotion/react';
import type { CheckboxProps as CheckboxPropsBase } from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';

import {
  CHECK_ICON_SIZES,
  StyledCheckboxIndicator,
  StyledCheckboxLabel,
  StyledCheckboxRoot,
  type CheckboxSize,
  type StyledCheckboxProps
} from '#components/Checkbox/Checkbox.style.ts';
import { Flex } from '#components/Flex/Flex.tsx';

export type { CheckboxSize };

export type CheckboxProps = CheckboxPropsBase &
  StyledCheckboxProps & {
    size?: CheckboxSize;
  };

export const Checkbox = ({ size = 'medium', ...props }: CheckboxProps) => {
  const theme = useTheme();
  const iconSize = CHECK_ICON_SIZES[size];

  return (
    <Flex gap={12} alignItems="center">
      <StyledCheckboxRoot $size={size} {...props}>
        <StyledCheckboxIndicator $size={size}>
          <motion.div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.15,
              ease: 'easeOut'
            }}
          >
            <Check
              size={iconSize}
              color={theme.color.white}
              strokeWidth={2.5}
            />
          </motion.div>
        </StyledCheckboxIndicator>
      </StyledCheckboxRoot>
      {props.children != null && (
        <StyledCheckboxLabel htmlFor={props.id} $disabled={props.disabled}>
          {props.children}
        </StyledCheckboxLabel>
      )}
    </Flex>
  );
};
