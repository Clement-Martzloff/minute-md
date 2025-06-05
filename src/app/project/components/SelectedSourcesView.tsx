"use client";

import { useSourcesStore } from "@/src/app/project/store/useSourcesStore";

interface SelectedSourcesViewProps {
  handleClick: (
    sources: (google.picker.DocumentObject & { selected: boolean })[]
  ) => void;
}

export default function SelectedSourcesView({
  handleClick,
}: SelectedSourcesViewProps) {
  const sourcesStore = useSourcesStore();
  if (!sourcesStore) return null;

  const sources = sourcesStore((state) => state.sources);
  if (!sources || sources.length === 0) {
    return <p>No sources selected.</p>;
  }

  return (
    <div>
      <h2>Selected sources</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.id}>{source.name}</li>
        ))}
      </ul>
      <button
        onClick={() => handleClick(sources)}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Process Selected sources
      </button>
    </div>
  );
}
