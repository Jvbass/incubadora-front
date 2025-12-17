import { create } from "zustand";

interface ActiveFieldStore {
  activeField: string | null;
  setActiveField: (field: string | null) => void;
}

export const useActiveFieldStore = create<ActiveFieldStore>((set) => ({
  activeField: null,
  setActiveField: (field) => set({ activeField: field }),
}));
