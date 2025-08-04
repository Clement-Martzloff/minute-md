"use client";

import GenerateReportButton from "@/src/app/components/generate-report/GenerateReportButton";
import { useReportStore } from "@/src/lib/store/useReportStore";

export default function GenerateReportIndex() {
  const sources = useReportStore((state) => state.sources);
  const status = useReportStore((state) => state.status);
  const processFiles = useReportStore((state) => state.processFiles);

  const isRunning = status === "running";

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
