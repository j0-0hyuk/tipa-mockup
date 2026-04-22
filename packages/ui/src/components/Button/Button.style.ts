import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';

export type ButtonVariant = 'filled' | 'outlined' | 'text' | 'warning';
export type ButtonSize = 'large' | 'medium' | 'small';

export interface StyledButtonProps {
  variant: ButtonVariant;
  size: ButtonSize;
  width?: string | number;
}

export const sizeStyles = {
  filled: {
    large: {
      borderRadius: '10px',
      typo: 'Md_16',
      padding: '12px 16px'
    },
    medium: {
      borderRadius: '8px',
      typo: 'Md_15',
      padding: '8.5px 16px'
    },
    small: {
      borderRadius: '8px',
      typo: 'Md_14',
      padding: '5.5px 12px'
    }
  },
  warning: {
    large: {
      borderRadius: '10px',
      typo: 'Md_16',
      padding: '12px 16px'
    },
    medium: {
      borderRadius: '8px',
      typo: 'Md_15',
      padding: '8.5px 16px'
    },
    small: {
      borderRadius: '8px',
      typo: 'Md_14',
      padding: '5.5px 12px'
    }
  },
  outlined: {
    large: {
      borderRadius: '10px',
      typo: 'Md_16',
      padding: '12px 16px'
    },
    medium: {
      borderRadius: '8px',
      typo: 'Md_15',
      padding: '8.5px 16px'
    },
    small: {
      borderRadius: '8px',
      typo: 'Md_14',
      padding: '5.5px 12px'
    }
  },
  text: {
    large: { padding: '12px 8px', typo: 'Md_16' },
    medium: { padding: '8.5px 8px', typo: 'Md_15' },
    small: { padding: '8px 6px', typo: 'Md_14' }
  }
} as const;

const propFilter = (prop: string) =>
  !['variant', 'size', 'width'].includes(prop) && isPropValid(prop);

export const StyledButton = styled('button', {
  shouldForwardProp: propFilter
})<StyledButtonProps>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: ${({ width }) =>
    width ? (typeof width === 'number' ? `${width}px` : width) : 'fit-content'};
  height: fit-content;

  /* 기본 초기화 */
  border: none;
  outline: none;
  text-align: center;
  cursor: pointer;
  white-space: nowrap;

  /* 애니메이션 */
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    opacity 0.2s ease;

  /* 사이즈 & 타이포그래피 (Md_16 사용) */
  ${({ variant, size, theme }) => {
    const spec = sizeStyles[variant][size];
    const borderRadius = 'borderRadius' in spec ? spec.borderRadius : '';

    return `
      ${theme.typo[spec.typo]}
      padding: ${spec.padding};
      ${borderRadius ? `border-radius: ${borderRadius};` : ''}
    `;
  }}

  /* 색상 Variants (Hover/Pressed/Disabled 로직) */
  ${({ variant, theme }) => {
    // Filled
    if (variant === 'filled') {
      return `
        background-color: ${theme.color.bgAccent};
        color: ${theme.color.white};
        
        /* Pressed & Hovered 동일 처리 */
        &:hover:not(:disabled),
        &:active:not(:disabled) {
          background-color: ${theme.color.bgAccentDark};
          color: ${theme.color.white};
        }
      `;
    }

    // Warning
    if (variant === 'warning') {
      return `
        background-color: ${theme.color.bgWarning};
        color: ${theme.color.white};
        
        &:hover:not(:disabled),
        &:active:not(:disabled) {
          background-color: ${theme.color.bgWarningDark};
          color: ${theme.color.white};
        }
      `;
    }

    // Outlined
    if (variant === 'outlined') {
      return `
        background-color: ${theme.color.bgWhite};
        border: 1px solid ${theme.color.lineDefault};
        color: ${theme.color.textPrimary};
        
        /* Pressed & Hovered: 배경 투명, border·color 유지 */
        &:hover:not(:disabled),
        &:active:not(:disabled) {
          background-color: transparent;
          border: 1px solid ${theme.color.lineDefault};
          color: ${theme.color.textPrimary};
        }
      `;
    }

    // Text
    return `
      background-color: transparent;
      color: ${theme.color.textPrimary};
      
      &:hover:not(:disabled),
      &:active:not(:disabled) {
        background-color: transparent;
        color: ${theme.color.textPrimary};
      }
    `;
  }}

  /* Disabled 공통 처리 (opacity 50%) */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const StyledIconWrapper = styled.div`
  display: flex;
  flex: 1;
`;
