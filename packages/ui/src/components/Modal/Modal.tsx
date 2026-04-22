import React, { createContext, useContext, type ReactNode } from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { X } from 'lucide-react';
import { useTheme } from '@emotion/react';
import { Button, type ButtonVariant } from '#components/Button/Button.tsx';
import type { ColorKey } from '#styles/emotion.d.ts';
import {
  StyledModalOverlay,
  StyledModalContent,
  StyledModalHeader,
  StyledModalTitle,
  StyledModalCloseButton,
  StyledModalBody,
  StyledModalFooter
} from '#components/Modal/Modal.style.ts';
import { Flex } from '#components/Flex/Flex.tsx';
/**
 * Modal 컴포넌트
 *
 * @deprecated 이 컴포넌트는 deprecated 예정입니다. 새로운 프로젝트나 기능에는 Dialog 컴포넌트를 사용해주세요.
 * Dialog 컴포넌트는 더 범용적이고 유연한 구조를 제공합니다.
 *
 * @see {@link Dialog} Dialog 컴포넌트로 마이그레이션을 권장합니다.
 */
interface ModalContextValue {
  isOpen: boolean;
  onClose: () => void;
}

interface ModalRootProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

interface ModalHeaderProps {
  icon?: ReactNode;
  title?: string | ReactNode;
  showCloseButton?: boolean;
  children?: ReactNode;
}

interface ModalBodyProps {
  children: ReactNode;
}

interface ModalFooterProps {
  children: ReactNode;
}

interface ModalButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  bgColor?: ColorKey;
  /**
   * Confirm 버튼 색상 variant.
   * - 기본값: 'filled'
   * - 삭제/경고 등 파괴적 액션에는 'warning'을 사용할 수 있음.
   */
  variant?: ButtonVariant;
}

const ModalContext = createContext<ModalContextValue | null>(null);

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal compound components must be used within a Modal');
  }
  return context;
};

const ModalRoot: React.FC<ModalRootProps> = ({ isOpen, onClose, children }) => {
  const contextValue = {
    isOpen,
    onClose
  };

  return (
    <ModalContext.Provider value={contextValue}>
      <AlertDialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
        <AlertDialogPrimitive.Overlay asChild>
          <StyledModalOverlay />
        </AlertDialogPrimitive.Overlay>
        <AlertDialogPrimitive.Content asChild>
          <StyledModalContent>{children}</StyledModalContent>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Root>
    </ModalContext.Provider>
  );
};

const ModalHeader: React.FC<ModalHeaderProps> = ({
  icon,
  title,
  showCloseButton = true,
  children
}) => {
  const theme = useTheme();
  const { onClose } = useModalContext();

  return (
    <StyledModalHeader>
      <AlertDialogPrimitive.Title asChild>
        <Flex direction="row" alignItems="center" gap="8px">
          {icon}
          <StyledModalTitle>{title}</StyledModalTitle>
        </Flex>
      </AlertDialogPrimitive.Title>
      {children}
      {showCloseButton && (
        <AlertDialogPrimitive.Cancel asChild>
          <StyledModalCloseButton onClick={onClose}>
            <X size={24} color={theme.color.textGray} />
          </StyledModalCloseButton>
        </AlertDialogPrimitive.Cancel>
      )}
    </StyledModalHeader>
  );
};

const ModalBody: React.FC<ModalBodyProps> = ({ children }) => {
  return (
    <AlertDialogPrimitive.Description asChild>
      <StyledModalBody>{children}</StyledModalBody>
    </AlertDialogPrimitive.Description>
  );
};

const ModalFooter: React.FC<ModalFooterProps> = ({ children }) => {
  return <StyledModalFooter>{children}</StyledModalFooter>;
};

const ModalCancelButton: React.FC<ModalButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = 'button'
}) => {
  const { onClose } = useModalContext();

  const handleClick = () => {
    onClick?.();
    onClose();
  };

  return (
    <AlertDialogPrimitive.Cancel asChild>
      <Button
        type={type}
        variant="outlined"
        size="medium"
        onClick={handleClick}
        disabled={disabled}
      >
        {children}
      </Button>
    </AlertDialogPrimitive.Cancel>
  );
};

const ModalConfirmButton: React.FC<ModalButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = 'button',
  variant = 'filled'
}) => {
  return (
    <Button
      variant={variant}
      size="medium"
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

interface ModalCompoundComponent extends React.FC<ModalRootProps> {
  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
  CancelButton: typeof ModalCancelButton;
  ConfirmButton: typeof ModalConfirmButton;
}

const Modal = ModalRoot as ModalCompoundComponent;

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.CancelButton = ModalCancelButton;
Modal.ConfirmButton = ModalConfirmButton;

export { Modal };
export type {
  ModalRootProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalButtonProps
};
