import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';
import * as RToggleGroup from '@radix-ui/react-toggle-group';

interface StyledToggleGroupProps {
  $border?: string;
  $borderRadius?: string;
}

interface StyledToggleItemProps {
  $borderRadius?: string;
}

export const StyledToggleGroup = styled(RToggleGroup.Root, {
  shouldForwardProp: isPropValid
})<StyledToggleGroupProps>`
  background-color: ${({ theme }) => theme.color.bgBlueGray};
  border-radius: ${({ $borderRadius }) => $borderRadius ?? '999px'};
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  height: fit-content;
  border: ${({ $border, theme }) =>
    $border ?? `1px solid ${theme.color.borderGray}`};
`;

export const StyledToggleItem = styled(RToggleGroup.Item, {
  shouldForwardProp: isPropValid
})<StyledToggleItemProps>`
  padding: 8px 27px;
  border-radius: ${({ $borderRadius }) => $borderRadius ?? '999px'};
  width: fit-content;
  height: fit-content;
  cursor: pointer;
  ${({ theme }) => theme.typo.Md_15};
  color: ${({ theme }) => theme.color.textGray};

  &[data-state='on'] {
    background-color: ${({ theme }) => theme.color.white};
    color: ${({ theme }) => theme.color.black};
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.1);
    svg {
      color: ${({ theme }) => theme.color.main};
    }
  }
`;
