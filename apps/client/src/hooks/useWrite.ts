"use client";
import { create } from "zustand";

export interface IWriteState {
  text: string[];
  index: number;
  delete: () => void;
  add: (txt: string) => void;
  traveling: (value: 1 | -1) => void;
}

export const useWrite = create<IWriteState>((set) => ({
  text: [""],
  index: 0,
  delete: () => set(() => ({ text: [] })),
  add: (txt: string) =>
    set((state) => {
      if (state.index + 1 != state.text.length) {
        const newText: string[] = state.text;
        newText.splice(state.index, state.text.length);

        return { text: newText, index: newText.length - 1 };
      }
      return { text: [...state.text, txt], index: state.index + 1 };
    }),
  traveling: (value: 1 | -1) => {
    set((state) => {
      if (
        state.index + value < 0 ||
        state.index + value > state.text.length - 1
      )
        return { index: state.index };
      return { index: state.index + value };
    });
  },
}));
