import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DriveFile } from "../types/drive"; // Import DriveFile from the new location

// Define the state shape for the Zustand store
export interface SourcesState {
  files: DriveFile[];
  addSources: (files: DriveFile[]) => void;
  removeSource: (id: string) => void;
  toggleSource: (id: string) => void;
  clearSources: () => void;
}

// Function to create the store with a dynamic key
// This function will be called with the user ID
const createSourcesStore = (userId: string) =>
  create<SourcesState>()(
    persist(
      (set) => ({
        files: [],
        addSources: (newFiles: DriveFile[]) =>
          set((state: SourcesState) => {
            // Filter out files that are already in the store by ID
            const existingFileIds = new Set(
              state.files.map((file: DriveFile) => file.id)
            );
            const filesToAdd = newFiles.filter(
              (file: DriveFile) => !existingFileIds.has(file.id)
            );

            // Add new files, ensuring 'selected' is true by default as they are just added
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
        name: `sources-${userId}`, // Dynamic key based on user ID
        storage: createJSONStorage(() => localStorage), // Use localStorage
      }
    )
  );

// We will export a function that returns the store instance
// This allows us to create a store instance per user session
export { createSourcesStore, type DriveFile }; // Export DriveFile type
