import React, { useContext } from 'react';

import { useTheme } from '@emotion/react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';

import {
  StyledSelectContent,
  StyledSelectTrigger,
  StyledSelectViewport,
  StyledSelectItem,
  StyledSelectLabel,
  StyledSelectValue,
  StyledSelectItemIndicator,
  type StyledSelectProps
} from '#components/Select/Select.style.ts';
import { Flex } from '#components/Flex/Flex.tsx';

interface SelectProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>,
      'onValueChange' | 'value'
    >,
    StyledSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  id?: string;
  name?: string;
  children: React.ReactNode;
  disabled?: boolean;
  iconSize?: number;
  leftIcon?: React.ReactNode;
}

const StyleContext = React.createContext<StyledSelectProps>({});

const SelectBase = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      value,
      onChange,
      onValueChange,
      placeholder,
      id,
      name,
      children,
      disabled,
      width,
      height,
      iconSize,
      padding,
      $typo,
      $color,
      leftIcon,
      ...props
    },
    ref
  ) => {
    const handleValueChange = (val: string) => {
      onChange?.(val);
      onValueChange?.(val);
    };

    const theme = useTheme();

    return (
      <StyleContext.Provider value={{ width, height, padding, $typo, $color }}>
        <SelectPrimitive.Root
          value={value}
          onValueChange={handleValueChange}
          disabled={disabled}
          {...props}
        >
          <StyledSelectTrigger
            width={width}
            height={height}
            padding={padding}
            ref={ref}
            id={id}
            name={name}
            $typo={$typo}
            $color={$color}
          >
            <Flex flex={1} gap={4} minWidth="0" alignItems="center">
              {leftIcon}
              <StyledSelectValue placeholder={placeholder} />
            </Flex>

            <Flex>
              <ChevronDown
                size={iconSize || 24}
                color={theme.color.textPlaceholder}
              />
            </Flex>
          </StyledSelectTrigger>
          <SelectPrimitive.Portal>
            <StyledSelectContent position="popper" sideOffset={5}>
              <StyledSelectViewport>{children}</StyledSelectViewport>
            </StyledSelectContent>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
      </StyleContext.Provider>
    );
  }
);
SelectBase.displayName = 'Select';

export interface SelectItemProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  children: React.ReactNode;
  value: string;
  disabled?: boolean;
}
const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, ...props }, ref) => {
    const theme = useTheme();
    const { $typo, padding, height, $color } = useContext(StyleContext);

    return (
      <StyledSelectItem
        $typo={$typo}
        padding={padding}
        height={height}
        $color={$color}
        {...props}
        ref={ref}
      >
        <SelectPrimitive.ItemText asChild>
          <div
            style={{
              flex: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {children}
          </div>
        </SelectPrimitive.ItemText>
        <StyledSelectItemIndicator>
          <Check size={20} color={theme.color.textGray} />
        </StyledSelectItemIndicator>
      </StyledSelectItem>
    );
  }
);
SelectItem.displayName = 'SelectItem';

interface SelectComponent
  extends React.ForwardRefExoticComponent<
    SelectProps & React.RefAttributes<HTMLButtonElement>
  > {
  Item: typeof SelectItem;
  Label: typeof SelectLabel;
}

const SelectLabel = function Label({
  children
}: {
  children: React.ReactNode;
}) {
  return <StyledSelectLabel>{children}</StyledSelectLabel>;
};

const Select = SelectBase as SelectComponent;
Select.Item = SelectItem;
Select.Label = SelectLabel;

export { Select, type SelectProps };
