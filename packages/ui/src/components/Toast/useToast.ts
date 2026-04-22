import { useToastContext } from '#components/Toast/useToastContext.ts';
import type { ToastProps } from '#components/Toast/Toast.type.ts';

export const useToast = () => {
  const { setOpen, setContent, setDuration, setPosition } = useToastContext();

  const toast = {
    open: ({ content, duration = 2000, position }: ToastProps) => {
      if (position) {
        setPosition(position);
      }
      setOpen(true);
      setContent(content);
      setDuration(duration);
    }
  };

  return toast;
};

export type ToastContext = ReturnType<typeof useToast>;
