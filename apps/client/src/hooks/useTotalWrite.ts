import { create } from "zustand";

export interface IWriteData {
  id: string | null;
  tags: { _id: string; name?: string }[];
  name: string;
  description: string;
  languaje: string | null;
  submitErrors?: string[];
}
interface IActions {
  addTag: (tag: { _id: string; name?: string }) => void;
  setTags: (tags: { _id: string; name?: string }[]) => void;
  deleteTag: (id: string) => void;
  setId: (name: string | null) => void;
  setName: (name: string) => void;
  setDescription: (desc: string) => void;
  setLang: (lang: string) => void;
  set: (data: IWriteData) => void;
  setErrors: (errors: string[]) => void;
}
export const useTotalWrite = create<IWriteData & IActions>((set) => ({
  id: null,
  tags: [],
  name: "",
  description: "",
  languaje: null,
  submitErrors: [],
  addTag: (tagToAdd) =>
    set((state) => {
      const actual = state.tags;
      if (actual.some((tag) => tag._id == tagToAdd._id))
        return { tags: actual };
      return { tags: [...actual, tagToAdd] };
    }),
  deleteTag: (id) =>
    set((state) => ({ tags: state.tags.filter((actual) => actual._id != id) })),
  setId: (name) => set(() => ({ id: name })),
  set: (data) => set(() => data),
  setName: (name) => set(() => ({ name })),
  setDescription: (desc) => set(() => ({ description: desc })),
  setLang: (lang) => set(() => ({ languaje: lang })),
  setErrors: (errors) => set({ submitErrors: errors }),
  setTags: (tags) => set(() => ({ tags: tags })),
}));
