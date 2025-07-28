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
    <div className="bg-secondary flex items-center gap-2 rounded-lg p-4">
      {isRunning ? (
        <Loader2 className="h-5 w-5 animate-spin text-black" strokeWidth={2} />
      ) : (
        <CheckCircle2 className="h-5 w-5 text-black" strokeWidth={2} />
      )}

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-lg tracking-tight">{truncatedStepName}</span>
        </div>
      </div>
    </div>
  );
}
