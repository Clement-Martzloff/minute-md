"use client";

import FileCard from "@/src/app/components/selected-files/FileCard";
import { useReportStore } from "@/src/lib/store/useReportStore";
import { useEffect, useRef, useState } from "react";

export default function SelectedFilesIndex() {
  const sources = useReportStore((state) => state.sources);
  const status = useReportStore((state) => state.status);

  const removeFile = useReportStore((state) => state.removeFile);

  const parentRef = useRef<HTMLDivElement>(null);

  const [prevLength, setPrevLength] = useState(sources.length);

  const isRunning = status === "running";

  useEffect(() => {
    const container = parentRef.current;
    if (!container) return;

    const isNearBottom = () => {
      return (
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100
      );
    };

    // Only scroll when new files are added
    if (sources.length > prevLength && isNearBottom()) {
      const lastChild = container.lastElementChild as HTMLElement | null;
      if (lastChild) {
        lastChild.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }

    setPrevLength(sources.length);
  }, [sources.length, prevLength]);

  if (sources.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold">Fichiers ({sources.length})</h3>

      <div className="mt-3 flex-col space-y-3" ref={parentRef}>
        {sources.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            removeFile={removeFile}
            isRunning={isRunning}
          />
        ))}
      </div>
    </div>
  );
}
