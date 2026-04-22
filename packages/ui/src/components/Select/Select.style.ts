import type {
  BorderRadiusKey,
  ColorKey,
  TypographyKey
} from '#styles/emotion.d.ts';
import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';
import * as SelectPrimitive from '@radix-ui/react-select';

export interface StyledSelectProps {
  height?: string | number;
  width?: string | number;
  padding?: string | number;
  $typo?: TypographyKey;
  $color?: ColorKey;
  $borderColor?: ColorKey;
  $borderRadius?: BorderRadiusKey;
}

export const StyledSelectTrigger = styled(SelectPrimitive.Trigger, {
  shouldForwardProp: isPropValid
})<StyledSelectProps>`
  display: flex;
  width: ${({ width }) =>
    typeof width === 'number' ? `${width}px` : width || 'auto'};
  height: ${({ height }) =>
    typeof height === 'number' ? `${height}px` : height || '48px'};
  padding: ${({ padding }) =>
    typeof padding === 'number' ? `${padding}px` : padding || '10px 16px'};
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-radius: ${({ $borderRadius, theme }) =>
    $borderRadius ? theme.borderRadius[$borderRadius] : '6px'};
  border: 1px solid
    ${({ $borderColor, theme }) =>
      $borderColor ? theme.color[$borderColor] : theme.color.borderGray};
  background: ${({ theme }) => theme.color.white};
  justify-content: space-between;

  color: ${({ $color, theme }) =>
    $color ? theme.color[$color] : theme.color.black};
  ${({ $typo, theme }) => ($typo ? theme.typo[$typo] : theme.typo.Rg_16)}

  &[data-placeholder] {
    color: ${({ theme }) => theme.color.textPlaceholder};
  }

  text-align: left !important;

  & span {
    width: 100% !important;
  }
`;

export const StyledSelectIcon = styled(SelectPrimitive.Icon)`
  margin-left: 8px;
  display: flex;
  align-items: center;
`;

export const StyledSelectValue = styled(SelectPrimitive.Value)`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StyledSelectContent = styled(SelectPrimitive.Content)`
  display: flex;
  width: var(--radix-select-trigger-width);
  max-height: var(--radix-select-content-available-height);

  flex-direction: column;
  align-items: flex-start;

  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  background: ${({ theme }) => theme.color.white};
  box-shadow: 0px 4px 12px 0px rgba(0, 27, 55, 0.15);
  z-index: 100;
`;

export const StyledSelectViewport = styled(SelectPrimitive.Viewport)`
  box-sizing: border-box;
  padding: 8px;
  width: 100%;
`;

export const StyledSelectLabel = styled(SelectPrimitive.Label)`
  font-size: 13px;
  color: #888;
  margin-bottom: 4px;
`;

export const StyledSelectItem = styled(SelectPrimitive.Item, {
  shouldForwardProp: isPropValid
})<StyledSelectProps>`
  display: flex;
  height: ${({ height }) =>
    typeof height === 'number' ? `${height}px` : height || '40px'};
  padding: ${({ padding }) =>
    typeof padding === 'number' ? `${padding}px` : padding || '8px 12px'};
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  align-self: stretch;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  border-radius: 6px;
  outline: none;
  overflow: visible;

  color: ${({ theme }) => theme.color.black};
  ${({ $typo, theme }) => ($typo ? theme.typo[$typo] : theme.typo.Rg_16)}

  &[data-highlighted] {
    background: ${({ theme }) => theme.color.bgGray};
  }
`;

export const StyledSelectItemIndicator = styled(SelectPrimitive.ItemIndicator)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;
