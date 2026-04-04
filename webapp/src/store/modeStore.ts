import { create } from 'zustand';

export type Mode = 'hr' | 'lead_dev' | 'curieux';

interface ModeState {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

export const useModeStore = create<ModeState>((set) => ({
  mode: 'curieux',
  setMode: (mode) => set({ mode }),
}));
