"use client";

import type { FileItem } from "@/src/app/project/components/file-uploader/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type StoreSource = FileItem & { selected: boolean };

export interface SourcesState {
  sources: StoreSource[];
  addSources: (sources: FileItem[]) => void;
  removeSource: (id: string) => void;
  toggleSource: (id: string) => void;
  clearSources: () => void;
}

export const useSourcesStore = create<SourcesState>()(
  persist(
    (set) => ({
      sources: [],
      addSources: (newSources) =>
        set((state) => {
          debugger;
          const existingSourceIds = new Set(
            state.sources.map((source) => source.id)
          );
          const sourcesToAdd = newSources.filter(
            (source) => !existingSourceIds.has(source.id)
          );
          const updatedSources = [
            ...state.sources,
            ...sourcesToAdd.map((source) => ({
              ...source,
              selected: true,
            })),
          ];
          return { sources: updatedSources };
        }),
      removeSource: (id) =>
        set((state) => ({
          sources: state.sources.filter((source) => source.id !== id),
        })),
      toggleSource: (id) =>
        set((state) => ({
          sources: state.sources.map((source) =>
            source.id === id
              ? { ...source, selected: !source.selected }
              : source
          ),
        })),
      clearSources: () => set({ sources: [] }),
    }),
    {
      name: "sources-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
