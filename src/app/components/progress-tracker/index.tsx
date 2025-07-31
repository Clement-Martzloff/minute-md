"use client";

import ProgressHeader from "@/src/app/components/progress-tracker/ProgressHeader";
import ProgressStep from "@/src/app/components/progress-tracker/ProgressStep";
import { useReportState } from "@/src/lib/hooks/useReportState";

export default function ProgressTracker() {
  const { pipelineState } = useReportState();
  const { stepName, status, failureReason } = pipelineState;

  if (status === "pending") return null;

  return (
    <div className="border-border bg-foreground/3 rounded-lg">
      <ProgressHeader status={status} failureReason={failureReason} />
      <div
        key={stepName || "report-finished"}
        className="animate-in fade-in slide-in-from-bottom-4 transition-all duration-500 ease-in-out"
      >
        <ProgressStep
          stepName={stepName}
          status={status}
          failureReason={failureReason}
        />
      </div>
    </div>
  );
}
