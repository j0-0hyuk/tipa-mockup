import { useContext } from 'react';
import { ToastContext } from '#components/Toast/Toast.context.ts';

export const useToastContext = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('ToastContext is not found');
  }

  return context;
};