import ProgressStep from "@/src/app/components/progress-tracker/ProgressStep";
import type { ProgressStep as ProgressStepType } from "@/src/app/components/progress-tracker/types";
import { useMemo } from "react";

interface ProgressStepsListProps {
  steps: ProgressStepType[];
}

export default function ProgressStepsList({ steps }: ProgressStepsListProps) {
  const currentStep = useMemo(() => {
    for (let i = steps.length - 1; i >= 0; i--) {
      if (steps[i].status === "running" || steps[i].status === "completed") {
        return steps[i];
      }
    }
    return null;
  }, [steps]);

  if (!currentStep) return null;

  return (
    <div className="p-4">
      <div
        key={currentStep.name}
        className="animate-in fade-in slide-in-from-bottom-4 transition-all duration-500 ease-in-out"
      >
        <ProgressStep step={currentStep} />
      </div>
    </div>
  );
}
