import React, { type ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useTheme } from '@emotion/react';
import {
  StyledDialogOverlay,
  StyledDialogContent,
  StyledDialogHeader,
  StyledDialogTitle,
  StyledDialogCloseButton,
  StyledDialogContentText,
  StyledDialogFooter
} from '#components/Dialog/Dialog.style.ts';

/**
 * Dialog 컴포넌트
 *
 * Modal 컴포넌트를 대체하는 새로운 다이얼로그 컴포넌트입니다.
 * 간단한 확인/경고 다이얼로그에 최적화되어 있으며, Footer는 외부에서 자유롭게 구성할 수 있어 범용성이 높습니다.
 */

interface DialogRootProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

interface DialogTitleProps {
  children: ReactNode;
}

interface DialogContentProps {
  children: ReactNode;
}

interface DialogFooterProps {
  children: ReactNode;
}

const DialogRoot: React.FC<DialogRootProps> = ({
  isOpen,
  onClose,
  children
}) => {
  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay asChild>
          <StyledDialogOverlay />
        </DialogPrimitive.Overlay>
        <DialogPrimitive.Content asChild>
          <StyledDialogContent>{children}</StyledDialogContent>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

const DialogTitle: React.FC<DialogTitleProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <StyledDialogHeader>
      <DialogPrimitive.Title asChild>
        <StyledDialogTitle>{children}</StyledDialogTitle>
      </DialogPrimitive.Title>
      <DialogPrimitive.Close asChild>
        <StyledDialogCloseButton>
          <X size={24} color={theme.color.textSecondary} />
        </StyledDialogCloseButton>
      </DialogPrimitive.Close>
    </StyledDialogHeader>
  );
};

const DialogContent: React.FC<DialogContentProps> = ({ children }) => {
  return <StyledDialogContentText>{children}</StyledDialogContentText>;
};

const DialogFooter: React.FC<DialogFooterProps> = ({ children }) => {
  return <StyledDialogFooter>{children}</StyledDialogFooter>;
};

interface DialogCompoundComponent extends React.FC<DialogRootProps> {
  title: typeof DialogTitle;
  content: typeof DialogContent;
  footer: typeof DialogFooter;
}

const Dialog = DialogRoot as DialogCompoundComponent;

Dialog.title = DialogTitle;
Dialog.content = DialogContent;
Dialog.footer = DialogFooter;

export { Dialog };
export type {
  DialogRootProps,
  DialogTitleProps,
  DialogContentProps,
  DialogFooterProps
};
