"use client";

import FileCard from "@/src/app/components/generate-report/FileCard";
import GenerateButton from "@/src/app/components/generate-report/GenerateButton";
import { useReportStore } from "@/src/lib/store/useReportStore";
import { Ref } from "react";

interface GenerateReportIndexProps {
  ref: Ref<HTMLDivElement>;
}

export default function GenerateReportIndex({ ref }: GenerateReportIndexProps) {
  const sources = useReportStore((state) => state.sources);
  const status = useReportStore((state) => state.status);
  const processFiles = useReportStore((state) => state.processFiles);
  const removeFile = useReportStore((state) => state.removeFile);

  const isRunning = status === "running";

  const handleProcessFiles = () => {
    const rawFiles = sources.flatMap((s) => (s.file ? [s.file] : []));
    processFiles(rawFiles);
  };

  return (
    <>
      <h3 className="font-semibold">Fichiers ({sources.length})</h3>

      <div className="mt-3 flex-col space-y-3">
        {sources.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            removeFile={removeFile}
            isRunning={isRunning}
          />
        ))}
        <GenerateButton
          isRunning={isRunning}
          handleProcessFiles={handleProcessFiles}
        />
        <div className="scroll-m-30" ref={ref} />
      </div>
    </>
  );
}
