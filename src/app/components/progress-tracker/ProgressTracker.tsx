"use client";

import ProgressHeader from "@/src/app/components/progress-tracker/ProgressHeader";
import ProgressStepsList from "@/src/app/components/progress-tracker/ProgressStepsList";
import { useReportPipeline } from "@/src/lib/hooks/useReportPipeline";

export default function ProgressTracker() {
  const { elapsedTime, pipelineState } = useReportPipeline();

  if (pipelineState.mainStatus === "Waiting...") return null;

  return (
    <div className="border-border bg-card mx-4 max-w-2xl rounded-lg shadow-2xl md:mx-auto md:w-full">
      <ProgressHeader
        elapsedTime={elapsedTime}
        mainStatus={pipelineState.mainStatus}
        isRunning={pipelineState.isRunning}
      />
      <ProgressStepsList steps={pipelineState.steps} />
    </div>
  );
}
