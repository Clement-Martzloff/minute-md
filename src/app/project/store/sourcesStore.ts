import { DriveFile } from "@/src/app/project/types/drive";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface SourcesState {
  files: DriveFile[];
  addSources: (files: DriveFile[]) => void;
  removeSource: (id: string) => void;
  toggleSource: (id: string) => void;
  clearSources: () => void;
}

function createSourcesStore(userId: string) {
  return create<SourcesState>()(
    persist(
      (set) => ({
        files: [],
        addSources: (newFiles: DriveFile[]) =>
          set((state: SourcesState) => {
            const existingFileIds = new Set(
              state.files.map((file: DriveFile) => file.id)
            );
            const filesToAdd = newFiles.filter(
              (file: DriveFile) => !existingFileIds.has(file.id)
            );
            const updatedFiles = [
              ...state.files,
              ...filesToAdd.map((file) => ({ ...file, selected: true })),
            ];
            return { files: updatedFiles };
          }),
        removeSource: (id) =>
          set((state) => ({
            files: state.files.filter((file) => file.id !== id),
          })),
        toggleSource: (id) =>
          set((state) => ({
            files: state.files.map((file) =>
              file.id === id ? { ...file, selected: !file.selected } : file
            ),
          })),
        clearSources: () => set({ files: [] }),
      }),
      {
        name: `sources-${userId}`,
        storage: createJSONStorage(() => localStorage),
      }
    )
  );
}

// We will export a function that returns the store instance
// This allows us to create a store instance per user session
export { createSourcesStore, type DriveFile }; // Export DriveFile type
