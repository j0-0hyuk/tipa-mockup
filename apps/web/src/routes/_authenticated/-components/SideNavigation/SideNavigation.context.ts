import { createContext } from 'react';

export interface SideNavigationContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

export const SideNavigationContext =
  createContext<SideNavigationContextProps | null>(null);
