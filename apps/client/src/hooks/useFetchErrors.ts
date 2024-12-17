import { create } from "zustand";

export interface IHFetchErrors {
  errors: string[];
}
interface IHMethods {
  set: (error: string[] | string) => void;
  removeAll: () => void;
}

export const useFetchErrors = create<IHFetchErrors & IHMethods>((set) => ({
  errors: [],
  set: (errors) =>
    set(() => ({ errors: Array.isArray(errors) ? errors : [errors] })),
  removeAll: () => set(() => ({ errors: [] })),
}));
