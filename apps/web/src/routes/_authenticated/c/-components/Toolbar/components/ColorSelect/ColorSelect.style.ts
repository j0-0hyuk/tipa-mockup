import styled from '@emotion/styled';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import isPropValid from '@emotion/is-prop-valid';

interface StyledColorSelectItemProps {
  $color: string;
  $size?: {
    outer: number;
    inner: number;
    default: number;
    indicator: number;
  };
}

export const StyledColorSelectItem = styled(RadioGroupPrimitive.Item, {
  shouldForwardProp: isPropValid
})<StyledColorSelectItemProps>`
  display: flex;
  width: ${({ $size }) => ($size ? `${$size.outer}px` : '48px')};
  height: ${({ $size }) => ($size ? `${$size.outer}px` : '48px')};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: transparent;

  padding: 0;

  border-radius: ${({ theme }) => theme.borderRadius.full};

  &[data-state='checked'] {
    border: 2px solid ${({ $color }) => $color};

    div {
      width: ${({ $size }) => ($size ? `${$size.inner}px` : '36px')};
      height: ${({ $size }) => ($size ? `${$size.inner}px` : '36px')};
    }
  }

  & > div {
    width: ${({ $size }) => ($size ? `${$size.default}px` : '40px')};
    height: ${({ $size }) => ($size ? `${$size.default}px` : '40px')};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    background: ${({ $color }) => $color};
  }
`;

export const StyledColorSelectIndicator = styled(RadioGroupPrimitive.Indicator)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
