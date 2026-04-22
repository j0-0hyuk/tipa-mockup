import { createContext, type Dispatch, type SetStateAction } from 'react';

export interface ToastContextProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  duration: number;
  setDuration: Dispatch<SetStateAction<number>>;
  position: 'top' | 'bottom';
  setPosition: Dispatch<SetStateAction<'top' | 'bottom'>>;
}

export const ToastContext = createContext<ToastContextProps | null>(null);
