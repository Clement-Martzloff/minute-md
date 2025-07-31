"use client";

import FileCard from "@/src/app/components/selected-files/FileCard";
import { useReportFiles } from "@/src/lib/hooks/useReportFiles";
import { useReportState } from "@/src/lib/hooks/useReportState";

export default function SelectedFilesIndex() {
  const { sources, removeFile } = useReportFiles();
  const { pipelineState } = useReportState();

  const isRunning = pipelineState.status === "running";

  if (sources.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Selected Files ({sources.length})</h3>

      <div className="flex-col space-y-3">
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
