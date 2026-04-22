import { create } from 'zustand';

type ToggleValue = 'left' | 'right';

interface ToggleStore {
  value: ToggleValue;
  setValue: (value: ToggleValue) => void;
}

export const useToggleStore = create<ToggleStore>((set) => ({
  value: 'left',
  setValue: (value) => set({ value })
}));
