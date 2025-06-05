"use client";

import { authClient } from "@/infrastructure/framework/better-auth/auth-client";
import { useMemo } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface SourcesState {
  sources: (google.picker.DocumentObject & { selected: boolean })[];
  addSources: (sources: google.picker.DocumentObject[]) => void;
  removeSource: (id: string) => void;
  toggleSource: (id: string) => void;
  clearSources: () => void;
}

function createSourcesStore(userId: string) {
  return create<SourcesState>()(
    persist(
      (set) => ({
        sources: [],
        addSources: (newSources) =>
          set((state) => {
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
        name: `sources-${userId}`,
        storage: createJSONStorage(() => localStorage),
      }
    )
  );
}

export function useSourcesStore() {
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const store = useMemo(() => {
    if (!session?.user?.id || sessionPending) return null;
    return createSourcesStore(session.user.id);
  }, [session?.user?.id, sessionPending]);

  return store;
}
