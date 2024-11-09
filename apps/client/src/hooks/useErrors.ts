import { create } from "zustand";

interface IError {
  value: string;
}
export interface IErrorHook {
  error: IError | null;
  delete: () => void;
  set: (error: string) => void;
}

export const useErrors = create<IErrorHook>((set) => ({
  error: null,
  delete: () => set(() => ({ error: null })),
  set: (error: string) => set(() => ({ error: { value: error } })),
}));
