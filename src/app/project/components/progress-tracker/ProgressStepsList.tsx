import ProgressStepItem from "@/src/app/project/components/progress-tracker/ProgressStep";
import type { ProgressStep } from "@/src/app/project/components/progress-tracker/types";

interface ProgressStepsListProps {
  steps: ProgressStep[];
  isFinished: boolean;
}

export default function ProgressStepsList({
  steps,
  isFinished,
}: ProgressStepsListProps) {
  if (steps.length === 0) return null;

  return (
    <div className="p-4">
      <h3 className="text-lg font-black text-black mb-4 tracking-tight">
        PROCESSING STEPS ({steps.filter((s) => s.status === "completed").length}
        /{steps.length})
      </h3>
      <ul className="space-y-3">
        {steps.map((step, index) => (
          <ProgressStepItem
            key={step.name}
            step={step}
            isFinished={isFinished}
            index={index}
          />
        ))}
      </ul>
    </div>
  );
}
