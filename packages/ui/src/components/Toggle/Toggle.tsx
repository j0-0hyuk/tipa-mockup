import {
  StyledToggleGroup,
  StyledToggleItem
} from '#components/Toggle/Toggle.style.ts';

export interface ToggleProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  value: string;
  onValueChange: (value: string | undefined) => void;
  border?: string;
  borderRadius?: string;
  leftValue?: string;
  rightValue?: string;
  'aria-label'?: string;
}

export function Toggle({
  leftContent,
  rightContent,
  value,
  onValueChange,
  border,
  borderRadius,
  leftValue = 'left',
  rightValue = 'right',
  'aria-label': ariaLabel = 'Toggle'
}: ToggleProps) {
  return (
    <StyledToggleGroup
      type="single"
      value={value}
      onValueChange={onValueChange}
      aria-label={ariaLabel}
      $border={border}
      $borderRadius={borderRadius}
    >
      <StyledToggleItem
        value={leftValue}
        aria-label="Left aligned"
        $borderRadius={borderRadius}
      >
        {leftContent}
      </StyledToggleItem>
      <StyledToggleItem
        value={rightValue}
        aria-label="Right aligned"
        $borderRadius={borderRadius}
      >
        {rightContent}
      </StyledToggleItem>
    </StyledToggleGroup>
  );
}
