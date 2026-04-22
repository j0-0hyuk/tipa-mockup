import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';

export type RadioButtonSize = 'large' | 'medium' | 'small';

const OUTER_SIZES: Record<RadioButtonSize, string> = {
  large: '24px',
  medium: '20px',
  small: '16px'
};

const INNER_SIZES: Record<RadioButtonSize, string> = {
  large: '14px',
  medium: '12px',
  small: '9.5px'
};

const BORDER_WIDTHS: Record<RadioButtonSize, string> = {
  large: '1.5px',
  medium: '1.25px',
  small: '1px'
};

export interface StyledRadioButtonProps {
  $size?: RadioButtonSize;
}

export interface StyledRadioGroupIndicatorProps {
  $size?: RadioButtonSize;
}

const rootPropFilter = (prop: string) => prop !== '$size' && isPropValid(prop);

const indicatorPropFilter = (prop: string) =>
  prop !== '$size' && isPropValid(prop);

export const StyledRadioGroupIndicator = styled('div', {
  shouldForwardProp: indicatorPropFilter
})<StyledRadioGroupIndicatorProps>`
  width: ${({ $size = 'medium' }) => INNER_SIZES[$size]};
  height: ${({ $size = 'medium' }) => INNER_SIZES[$size]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: currentColor;
`;

export const StyledRadioButton = styled('div', {
  shouldForwardProp: rootPropFilter
})<StyledRadioButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  flex-shrink: 0;

  width: ${({ $size = 'medium' }) => OUTER_SIZES[$size]};
  height: ${({ $size = 'medium' }) => OUTER_SIZES[$size]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: ${({ theme, $size = 'medium' }) =>
    `${BORDER_WIDTHS[$size]} solid ${theme.color.lineDefault}`};
  background-color: ${({ theme }) => theme.color.bgWhite};
  cursor: pointer;
  color: transparent;

  transition:
    border-color 0.2s ease,
    opacity 0.2s ease;

  &[data-state='checked'] {
    border-color: ${({ theme }) => theme.color.lineAccent};
    color: ${({ theme }) => theme.color.bgAccent};
  }

  &[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: ${({ theme }) => theme.color.lineDefault};
    color: transparent;
  }
`;
