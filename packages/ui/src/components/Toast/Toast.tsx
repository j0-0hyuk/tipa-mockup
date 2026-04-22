import * as ToastPrimitive from '@radix-ui/react-toast';
import {
  StyledToastDescription,
  StyledToastRoot,
  StyledToastViewport
} from '#components/Toast/Toast.style.ts';
import { ToastContext } from '#components/Toast/Toast.context.ts';
import { useState } from 'react';

export const ToastProvider = ({
  children,
  position: defaultPosition = 'bottom',
  viewportOffset = 20,
  ...props
}: ToastPrimitive.ToastProviderProps & {
  position?: 'top' | 'bottom';
  viewportOffset?: number;
}) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState<'top' | 'bottom'>(defaultPosition);

  return (
    <ToastContext.Provider
      value={{
        open,
        setOpen,
        content,
        setContent,
        duration,
        setDuration,
        position,
        setPosition
      }}
    >
      <ToastPrimitive.Provider swipeDirection="down" {...props}>
        {children}
        <ToastPrimitive.Root
          open={open}
          onOpenChange={setOpen}
          duration={duration}
          asChild
        >
          <StyledToastRoot $position={position}>
            <ToastPrimitive.Description asChild>
              <StyledToastDescription>{content}</StyledToastDescription>
            </ToastPrimitive.Description>
          </StyledToastRoot>
        </ToastPrimitive.Root>
        <ToastPrimitive.Viewport asChild>
          <StyledToastViewport
            $position={position}
            $viewportOffset={viewportOffset}
          />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
};
