import { create } from 'zustand';

export type PortfolioMode = 'hr' | 'lead_dev' | 'curieux';

interface ThemeState {
  mode: PortfolioMode;
  setMode: (mode: PortfolioMode) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'hr', // Mode par défaut
  setMode: (mode) => set({ mode }),
}));
