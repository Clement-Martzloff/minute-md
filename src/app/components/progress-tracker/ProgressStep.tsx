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
    <div className="flex items-center gap-4 rounded-none border-2 border-black bg-cyan-100 p-4 shadow-[4px_4px_0px_0px_#000] transition-all duration-200">
      <div className="rounded-none border-2 border-black bg-blue-300 p-2 shadow-[2px_2px_0px_0px_#000] transition-all duration-300">
        {isRunning ? (
          <Loader2
            className="h-5 w-5 animate-spin text-black"
            strokeWidth={2}
          />
        ) : (
          <CheckCircle2 className="h-5 w-5 text-black" strokeWidth={2} />
        )}
      </div>
      <div className="flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight whitespace-nowrap text-black">
            {truncatedStepName}
          </span>
        </div>
      </div>
    </div>
  );
}
