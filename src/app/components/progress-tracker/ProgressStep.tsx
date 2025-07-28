import type { ProgressStep } from "@/src/app/components/progress-tracker/types";
import { useResponsiveTruncation } from "@/src/lib/hooks/useResponsiveTruncation";
import { CheckCircle2, Loader2 } from "lucide-react";

interface ProgressStepProps {
  step: ProgressStep;
  isAnimated?: boolean;
}

export default function ProgressStep({ step }: ProgressStepProps) {
  const isRunning = step.status === "running";
  const truncatedStepName = useResponsiveTruncation(step.name, {
    mobileS: 15,
    mobileM: 20,
    mobileL: 25,
  });

  return (
    <div className="flex items-center gap-2 rounded-lg p-2">
      {isRunning ? (
        <Loader2 className="h-4 w-4 animate-spin text-black" />
      ) : (
        <CheckCircle2 className="h-4 w-4 text-black" />
      )}

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="">{truncatedStepName}</span>
        </div>
      </div>
    </div>
  );
}
