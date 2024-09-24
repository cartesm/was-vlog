import { create } from "zustand";

export const useAuth = create((set) => ({
  data: null,
  set: (authData) => set({ data: authData }),
}));
