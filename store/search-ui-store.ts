"use client";

import { create } from "zustand";

type SearchUiStore = {
  query: string;
  setQuery: (query: string) => void;
  reset: () => void;
};

export const useSearchUiStore = create<SearchUiStore>((set) => ({
  query: "",
  setQuery: (query) => set({ query }),
  reset: () => set({ query: "" })
}));
