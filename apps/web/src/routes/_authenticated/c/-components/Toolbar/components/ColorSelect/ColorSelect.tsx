import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { forwardRef } from 'react';
import {
  StyledColorSelectIndicator,
  StyledColorSelectItem
} from '@/routes/_authenticated/c/-components/Toolbar/components/ColorSelect/ColorSelect.style';
import { Check } from 'lucide-react';
import { Flex } from '@docs-front/ui';
import { CHART_COLORS } from '@/constants/chartColors.constant';
import { useTheme } from '@emotion/react';

type Size = 'sm' | 'lg';

const SIZE_MAP: Record<
  Size,
  {
    outer: number;
    inner: number;
    default: number;
    indicator: number;
  }
> = {
  sm: {
    outer: 24,
    inner: 18,
    default: 24,
    indicator: 12
  },
  lg: {
    outer: 48,
    inner: 36,
    default: 40,
    indicator: 20
  }
};

export interface ColorSelectProps {
  onChange?: (value: keyof typeof CHART_COLORS) => void;
  onValueChange?: (value: keyof typeof CHART_COLORS) => void;
  size?: Size;
}

const ColorSelect = forwardRef<
  HTMLDivElement,
  RadioGroupPrimitive.RadioGroupProps & ColorSelectProps
>(({ onChange, onValueChange, value, size = 'lg', ...props }, ref) => {
  const handleValueChange = (value: keyof typeof CHART_COLORS) => {
    onChange?.(value);
    onValueChange?.(value);
  };

  const theme = useTheme();

  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      onValueChange={handleValueChange}
      value={value}
      {...props}
    >
      <Flex gap={8} alignItems="center">
        {Object.entries(CHART_COLORS).map(([key, color]) => (
          <StyledColorSelectItem
            key={key}
            value={key}
            $color={theme.color[color] as string}
            $size={SIZE_MAP[size]}
          >
            <div>
              <StyledColorSelectIndicator>
                <Check size={SIZE_MAP[size].indicator} color="white" />
              </StyledColorSelectIndicator>
            </div>
          </StyledColorSelectItem>
        ))}
      </Flex>
    </RadioGroupPrimitive.Root>
  );
});

ColorSelect.displayName = 'ColorSelect';

export { ColorSelect };
