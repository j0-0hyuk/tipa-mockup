import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';
import {
  sizeStyles,
  type ButtonVariant,
  type ButtonSize,
  type StyledButtonProps
} from '#components/Button/Button.style.ts';

// IconButton도 Button과 동일한 props 구조 사용
export type { StyledButtonProps, ButtonVariant, ButtonSize };

/**
 * 디자인 시스템 IconButton padding (사이즈별 정사각형)
 * large: 12px, medium: 10px, small: 8px
 */
const ICON_BUTTON_PADDING = {
  large: '12px',
  medium: '10px',
  small: '8px'
} as const;

/**
 * IconButton용 sizeStyles (padding만 디자인 시스템 값 사용, 나머지는 Button과 동일)
 */
const iconButtonSizeStyles = {
  filled: {
    large: {
      ...sizeStyles.filled.large,
      padding: `${ICON_BUTTON_PADDING.large} ${ICON_BUTTON_PADDING.large}`
    },
    medium: {
      ...sizeStyles.filled.medium,
      padding: `${ICON_BUTTON_PADDING.medium} ${ICON_BUTTON_PADDING.medium}`
    },
    small: {
      ...sizeStyles.filled.small,
      padding: `${ICON_BUTTON_PADDING.small} ${ICON_BUTTON_PADDING.small}`
    }
  },
  warning: {
    large: {
      ...sizeStyles.warning.large,
      padding: `${ICON_BUTTON_PADDING.large} ${ICON_BUTTON_PADDING.large}`
    },
    medium: {
      ...sizeStyles.warning.medium,
      padding: `${ICON_BUTTON_PADDING.medium} ${ICON_BUTTON_PADDING.medium}`
    },
    small: {
      ...sizeStyles.warning.small,
      padding: `${ICON_BUTTON_PADDING.small} ${ICON_BUTTON_PADDING.small}`
    }
  },
  outlined: {
    large: {
      ...sizeStyles.outlined.large,
      padding: `${ICON_BUTTON_PADDING.large} ${ICON_BUTTON_PADDING.large}`
    },
    medium: {
      ...sizeStyles.outlined.medium,
      padding: `${ICON_BUTTON_PADDING.medium} ${ICON_BUTTON_PADDING.medium}`
    },
    small: {
      ...sizeStyles.outlined.small,
      padding: `${ICON_BUTTON_PADDING.small} ${ICON_BUTTON_PADDING.small}`
    }
  },
  text: {
    large: {
      ...sizeStyles.text.large,
      padding: `${ICON_BUTTON_PADDING.large} ${ICON_BUTTON_PADDING.large}`
    },
    medium: {
      ...sizeStyles.text.medium,
      padding: `${ICON_BUTTON_PADDING.medium} ${ICON_BUTTON_PADDING.medium}`
    },
    small: {
      ...sizeStyles.text.small,
      padding: `${ICON_BUTTON_PADDING.small} ${ICON_BUTTON_PADDING.small}`
    }
  }
} as const;

const propFilter = (prop: string) =>
  !['variant', 'size'].includes(prop) && isPropValid(prop);

export const StyledIconButton = styled('button', {
  shouldForwardProp: propFilter
})<StyledButtonProps>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 0;
  width: fit-content;
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

  /* 사이즈 & 타이포그래피 (Button과 동일, padding만 변환) */
  ${({ variant, size, theme }) => {
    const spec = iconButtonSizeStyles[variant][size];
    const borderRadius = 'borderRadius' in spec ? spec.borderRadius : '';

    return `
      ${theme.typo[spec.typo]}
      padding: ${spec.padding};
      ${borderRadius ? `border-radius: ${borderRadius};` : ''}
    `;
  }}

  /* 색상 Variants (Button과 동일) */
  ${({ variant, theme }) => {
    // Filled
    if (variant === 'filled') {
      return `
        background-color: ${theme.color.bgAccent};
        color: ${theme.color.white};
        
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

  /* Disabled 공통 처리 */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
