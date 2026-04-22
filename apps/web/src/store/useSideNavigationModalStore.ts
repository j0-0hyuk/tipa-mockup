import { create } from 'zustand';

interface SideNavigationModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useSideNavigationModalStore = create<SideNavigationModalStore>(
  (set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false })
  })
);
