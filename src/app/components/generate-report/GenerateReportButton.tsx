"use client";

import { Button } from "@/src/components/ui/button";
import { useReportFiles } from "@/src/lib/hooks/useReportFiles";
import { useReportState } from "@/src/lib/hooks/useReportState";
import { ArrowRight } from "lucide-react";

export default function GenerateReportButton() {
  const { sources } = useReportFiles();
  const { pipelineState, processFiles } = useReportState();

  const handleProcessFiles = () => {
    const rawFiles = sources
      .map((source) => source.file)
      .filter(Boolean) as File[];

    if (processFiles) {
      processFiles(rawFiles);
    }
  };

  return (
    <>
      <div className="flex">
        <Button
          className="w-full cursor-pointer md:w-fit"
          onClick={handleProcessFiles}
          size="lg"
          disabled={pipelineState.isRunning}
        >
          <span className="font-semibold tracking-wide">
            {pipelineState.isRunning ? "Processing..." : "Create Report"}
          </span>
          <ArrowRight />
        </Button>
      </div>
    </>
  );
}
