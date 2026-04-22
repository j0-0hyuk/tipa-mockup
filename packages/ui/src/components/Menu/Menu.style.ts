import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export interface StyledMenuItemProps {
  width?: number | string;
}

export const StyledMenuContent = styled(DropdownMenu.Content)`
  display: flex;
  flex-direction: column;
  padding: 4px;
  gap: 0;

  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.lineLight};
  background: ${({ theme }) => theme.color.bgWhite};
  box-shadow: ${({ theme }) => theme.shadow.modal};
  z-index: 50;
`;

export const StyledMenuItem = styled(DropdownMenu.Item, {
  shouldForwardProp: isPropValid
})<StyledMenuItemProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  box-sizing: border-box;

  width: ${({ width }) =>
    typeof width === 'number' ? `${width}px` : width || '120px'};
  padding: 9.5px 10px;

  border: none;
  border-radius: 6px;
  outline: none;
  background: ${({ theme }) => theme.color.bgWhite};
  color: ${({ theme }) => theme.color.textPrimary};

  ${({ theme }) => theme.typo.Md_14};
  text-align: left;

  &[data-highlighted],
  &:active {
    background: ${({ theme }) => theme.color.bgMediumGrey};
  }

  &[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const StyledMenuItemLeft = styled('div')`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
`;

export const StyledMenuItemText = styled('span')`
  flex: 1;
  min-width: 0;
  text-align: left;
  color: ${({ theme }) => theme.color.textPrimary};
`;

export const StyledMenuLeadingIcon = styled('span')`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.color.textPrimary};

  & > svg {
    width: 16px;
    height: 16px;
  }
`;

export const StyledMenuTrailingIcon = styled('span')`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.color.textTertiary};

  & > svg {
    width: 16px;
    height: 16px;
  }
`;
