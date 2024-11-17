import { create } from "zustand";

export interface IErrorHook {
  text: string[];
  delete: () => void;
  set: (txt: string, index: number) => void;
}

export const useErrors = create<IErrorHook>((set) => ({
  text: [],
  delete: () => set(() => ({ text: [] })),
  set: (txt: string, index: number) => set(() => ({})),
}));
