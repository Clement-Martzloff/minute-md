"use client";

import GenerateReportButton from "@/src/app/components/generate-report/GenerateReportButton";
import { useReportFiles } from "@/src/lib/hooks/useReportFiles";
import { useReportState } from "@/src/lib/hooks/useReportState";

export default function GenerateReportIndex() {
  const { sources } = useReportFiles();
  const { pipelineState, processFiles } = useReportState();

  const isRunning = pipelineState.status === "running";

  const handleProcessFiles = () => {
    const rawFiles = sources.flatMap((s) => (s.file ? [s.file] : []));
    processFiles(rawFiles);
  };

  if (sources.length === 0) return null;

  return (
    <GenerateReportButton
      isRunning={isRunning}
      handleProcessFiles={handleProcessFiles}
    />
  );
}
