'use client';

import { create } from 'zustand';

export type UiNoticeKind = 'success' | 'error' | 'info';

type UiNotice = {
  kind: UiNoticeKind;
  message: string;
};

type UiStoreState = {
  notice: UiNotice | null;
  setNotice: (notice: UiNotice) => void;
  clearNotice: () => void;
};

export const useUiStore = create<UiStoreState>((set) => ({
  notice: null,
  setNotice: (notice) => set({ notice }),
  clearNotice: () => set({ notice: null }),
}));
