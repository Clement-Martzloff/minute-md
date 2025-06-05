"use client";

import GooglePickerButton from "@/src/app/project/components/GooglePickerButton";
import SelectedFilesList from "@/src/app/project/components/SelectedSourcesList";
import { useSourcesStore } from "@/src/app/project/store/useSourcesStore";

function Sources() {
  const sourcesStore = useSourcesStore();
  if (!sourcesStore) return null;

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <GooglePickerButton
        addSources={sourcesStore((store) => store.addSources)}
      />
      <SelectedFilesList
        sources={sourcesStore((store) => store.sources)}
        removeSource={sourcesStore((store) => store.removeSource)}
        toggleSource={sourcesStore((store) => store.toggleSource)}
        clearSources={sourcesStore((store) => store.clearSources)}
      />
    </div>
  );
}

export default Sources;
