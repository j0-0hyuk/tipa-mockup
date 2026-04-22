import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';

interface StyledInputProps {
  width?: string | number;
  height?: string | number;
  borderColor: string;
  disabled?: boolean;
}

export const StyledInputWrapper = styled('div', {
  shouldForwardProp: isPropValid
})<StyledInputProps>`
  display: flex;
  padding: 0 16px;
  align-items: center;
  gap: 10px;
  align-self: stretch;

  border-radius: 6px;
  background: #fff;
  border: 1px solid ${({ borderColor }) => borderColor};

  transition: border-color 0.2s ease-in-out;

  height: ${({ height }) =>
    typeof height === 'number' ? `${height}px` : height || '46px'};
  width: ${({ width }) =>
    typeof width === 'number' ? `${width}px` : width || 'auto'};

  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

export const StyledInput = styled.input`
  display: inline-block;
  align-items: center;
  height: 100%;

  &::placeholder {
    color: ${({ theme }) => theme.color.textPlaceholder};
  }

  width: 100%;
  border: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'text')};

  ${({ theme }) => theme.typo.Rg_16}
`;
