"use client";

import React from "react";
import { useStore } from "zustand";
import { createSourcesStore, type SourcesState } from "../store/sourcesStore";
import GooglePickerButton from "./GooglePickerButton";
import SelectedFilesList from "./SelectedFilesList";

interface SourcesProps {
  userId: string;
}

const Sources: React.FC<SourcesProps> = ({ userId }) => {
  const sourcesStore = React.useMemo(
    () => createSourcesStore(userId),
    [userId]
  );

  const files = useStore(sourcesStore, (state: SourcesState) => state.files);
  const removeSource = useStore(
    sourcesStore,
    (state: SourcesState) => state.removeSource
  );
  const toggleSource = useStore(
    sourcesStore,
    (state: SourcesState) => state.toggleSource
  );
  const clearSources = useStore(
    sourcesStore,
    (state: SourcesState) => state.clearSources
  );
  const addSources = useStore(
    sourcesStore,
    (state: SourcesState) => state.addSources
  );

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <GooglePickerButton addSources={addSources} />
      <SelectedFilesList
        files={files}
        removeSource={removeSource}
        toggleSource={toggleSource}
        clearSources={clearSources}
      />
    </div>
  );
};

export default Sources;
