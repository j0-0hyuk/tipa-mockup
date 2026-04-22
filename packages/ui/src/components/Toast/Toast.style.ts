import styled from '@emotion/styled';

export const StyledToastViewport = styled.div<{
  $position: 'top' | 'bottom';
  $viewportOffset?: number;
}>`
  --viewport-padding: 36px;
  position: fixed;
  ${({ $position, $viewportOffset = 20 }) =>
    $position === 'top'
      ? `top: ${$viewportOffset}px;`
      : `bottom: ${$viewportOffset}px;`}
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 100vw;
  padding: 0 16px;
  list-style: none;
  z-index: 2147483647;
  outline: none;
  @media (max-width: 500px) {
    width: 100vw;
  }
`;

export const StyledToastDescription = styled.p`
  ${({ theme }) => theme.typo.Rg_14};
  color: ${({ theme }) => theme.color.white};
  white-space: pre-line;
  text-align: center;
  width: 100%;
`;

export const StyledToastRoot = styled.div<{ $position: 'top' | 'bottom' }>`
  background: ${({ theme }) => theme.color.bgDarkGray};
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 12px 0 rgba(0, 27, 55, 0.15);
  padding: 14px 16px;
  display: grid;
  grid-template-areas: 'title action' 'description action';
  grid-template-columns: auto max-content;
  align-items: center;

  &[data-state='open'] {
    animation: ${({ $position }) =>
        $position === 'top' ? 'slideInTop' : 'slideIn'}
      150ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  &[data-state='closed'] {
    animation: hide 100ms ease-in;
  }

  &[data-swipe='move'] {
    transform: translateY(var(--radix-toast-swipe-move-y));
  }

  &[data-swipe='cancel'] {
    transform: translateY(0);
    transition: transform 200ms ease-out;
  }

  &[data-swipe='end'] {
    animation: ${({ $position }) =>
        $position === 'top' ? 'swipeOutTop' : 'swipeOut'}
      100ms ease-out;
  }

  @keyframes hide {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes slideIn {
    from {
      transform: translateY(calc(100% + var(--viewport-padding)));
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes slideInTop {
    from {
      transform: translateY(calc(-100% - var(--viewport-padding)));
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes swipeOut {
    from {
      transform: translateY(var(--radix-toast-swipe-end-y));
    }
    to {
      transform: translateY(calc(100% + var(--viewport-padding)));
    }
  }

  @keyframes swipeOutTop {
    from {
      transform: translateY(var(--radix-toast-swipe-end-y));
    }
    to {
      transform: translateY(calc(-100% - var(--viewport-padding)));
    }
  }
`;
