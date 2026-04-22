import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

export type CheckboxSize = 'large' | 'medium' | 'small';

const BOX_SIZES: Record<CheckboxSize, string> = {
  large: '20px',
  medium: '16px',
  small: '12px'
};

const BORDER_RADII: Record<CheckboxSize, string> = {
  large: '5px',
  medium: '4px',
  small: '3px'
};

const PADDING = '2px';

export const CHECK_ICON_SIZES: Record<CheckboxSize, number> = {
  large: 16,
  medium: 12,
  small: 8
};

const INNER_SIZES: Record<CheckboxSize, string> = {
  large: '16px',
  medium: '12px',
  small: '8px'
};

export interface StyledCheckboxRootProps {
  $size?: CheckboxSize;
}

export interface StyledCheckboxIndicatorProps {
  $size?: CheckboxSize;
}

export interface StyledCheckboxLabelProps {
  $disabled?: boolean;
}

export type StyledCheckboxProps = StyledCheckboxRootProps;

const rootPropFilter = (prop: string) => prop !== '$size' && isPropValid(prop);

export const StyledCheckboxRoot = styled(CheckboxPrimitive.Root, {
  shouldForwardProp: rootPropFilter
})<StyledCheckboxRootProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  flex-shrink: 0;

  width: ${({ $size = 'medium' }) => BOX_SIZES[$size]};
  height: ${({ $size = 'medium' }) => BOX_SIZES[$size]};
  padding: ${PADDING};
  border-radius: ${({ $size = 'medium' }) => BORDER_RADII[$size]};
  border: 1px solid ${({ theme }) => theme.color.lineDefault};
  background-color: ${({ theme }) => theme.color.bgWhite};

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    opacity 0.2s ease;

  &[data-state='unchecked']:hover:not([data-disabled]) {
    background-color: ${({ theme }) => theme.color.bgLightGrey};
  }

  /* selected */
  &[data-state='checked'] {
    border-color: ${({ theme }) => theme.color.bgAccent};
    background-color: ${({ theme }) => theme.color.bgAccent};
  }

  /* selected + hover*/
  &[data-state='checked']:hover:not([data-disabled]) {
    background-color: ${({ theme }) => theme.color.bgAccentDark};
    border-color: ${({ theme }) => theme.color.bgAccentDark};
  }

  /* pressed (checked + active) */
  &[data-state='checked']:active {
    background-color: ${({ theme }) => theme.color.bgAccentDark};
    border-color: ${({ theme }) => theme.color.bgAccentDark};
  }

  /* disabled: unselected와 동일한 외관 + opacity 50% */
  &[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const indicatorPropFilter = (prop: string) =>
  prop !== '$size' && isPropValid(prop);

export const StyledCheckboxIndicator = styled(CheckboxPrimitive.Indicator, {
  shouldForwardProp: indicatorPropFilter
})<StyledCheckboxIndicatorProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size = 'medium' }) => INNER_SIZES[$size]};
  height: ${({ $size = 'medium' }) => INNER_SIZES[$size]};
`;

const labelPropFilter = (prop: string) =>
  prop !== '$disabled' && isPropValid(prop);

export const StyledCheckboxLabel = styled('label', {
  shouldForwardProp: labelPropFilter
})<StyledCheckboxLabelProps>`
  ${({ theme }) => theme.typo.Md_14};
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.color.textDisabled : theme.color.textPrimary};
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  user-select: none;
`;
