"use client";

import { useSourcesStore } from "@/src/app/project/store/useSourcesStore";
import { useTransition } from "react";

interface SelectedSourcesViewProps {
  handleClick: (
    sources: (google.picker.DocumentObject & { selected: boolean })[]
  ) => void;
}

export default function SelectedSourcesView({
  handleClick,
}: SelectedSourcesViewProps) {
  const [isPending, startTransition] = useTransition();
  const sources = useSourcesStore((state) => state.sources);

  return sources.length === 0 ? (
    <p className="text-center text-gray-500">No sources selected yet.</p>
  ) : (
    <div>
      <h2>Selected sources</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.id}>{source.name}</li>
        ))}
      </ul>
      <button
        onClick={() => startTransition(() => handleClick(sources))}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        disabled={isPending}
      >
        {isPending ? "Processing..." : "Process Selected sources"}
      </button>
    </div>
  );
}
