"use client";

import ProgressHeader from "@/src/app/components/progress-tracker/ProgressHeader";
import ProgressStep from "@/src/app/components/progress-tracker/ProgressStep";
import { useReportStore } from "@/src/lib/store/useReportStore";
import { Ref } from "react";

interface ProgressTrackerIndex {
  ref: Ref<HTMLDivElement>;
}

export default function ProgressTrackerIndex({ ref }: ProgressTrackerIndex) {
  const status = useReportStore((state) => state.status);
  const stepName = useReportStore((state) => state.stepName);
  const failureReason = useReportStore((state) => state.failureReason);

  return (
    <div className="border-border bg-secondary rounded-lg">
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
      <div ref={ref}></div>
    </div>
  );
}
