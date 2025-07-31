import ProgressStep from "@/src/app/components/progress-tracker/ProgressStep";
import { useReportState } from "@/src/lib/hooks/useReportState";
import { useMemo } from "react";

export default function ProgressStepsList() {
  const { pipelineState } = useReportState();

  const currentStep = useMemo(() => {
    for (let i = pipelineState.steps.length - 1; i >= 0; i--) {
      if (
        pipelineState.steps[i].status === "running" ||
        pipelineState.steps[i].status === "completed"
      ) {
        return pipelineState.steps[i];
      }
    }
    return null;
  }, [pipelineState.steps]);

  if (!currentStep && !pipelineState.isFinished) return null;

  return (
    <div>
      <div
        key={currentStep?.name || "report-finished"}
        className="animate-in fade-in slide-in-from-bottom-4 transition-all duration-500 ease-in-out"
      >
        <ProgressStep
          step={currentStep}
          isFinished={pipelineState.isFinished}
        />
      </div>
    </div>
  );
}
