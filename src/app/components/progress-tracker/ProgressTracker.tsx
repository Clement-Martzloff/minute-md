"use client";

import ProgressHeader from "@/src/app/components/progress-tracker/ProgressHeader";
import ProgressStepsList from "@/src/app/components/progress-tracker/ProgressStepsList";
import { useReportState } from "@/src/lib/hooks/useReportState";

export default function ProgressTracker() {
  const { pipelineState } = useReportState();

  if (pipelineState.mainStatus === "Waiting...") return null;

  return (
    <div className="border-border bg-foreground/3 rounded-lg">
      <ProgressHeader />
      <ProgressStepsList />
    </div>
  );
}
