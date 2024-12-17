import { create } from "zustand";

export interface IHTags {
  tags: { _id: string; name?: string }[];
}
interface IHMethods {
  add: (tag: { _id: string; name?: string }) => void;
  set: (tags: { _id: string; name?: string }[]) => void;
  delete: (tagId: string) => void;
}

export const useWriteTags = create<IHTags & IHMethods>((set) => ({
  tags: [],
  add: (tag) => set((actual) => ({ tags: [...actual.tags, tag] })),
  delete: (tagId) =>
    set((actual) => ({ tags: actual.tags.filter((tag) => tag._id != tagId) })),
  set: (tags) => set(() => ({ tags })),
}));
