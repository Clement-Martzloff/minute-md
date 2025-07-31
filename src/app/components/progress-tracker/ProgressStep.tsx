import type { ProgressStep } from "@/src/app/components/progress-tracker/types";
import { useResponsiveTruncation } from "@/src/lib/hooks/useResponsiveTruncation";

interface ProgressStepProps {
  step: ProgressStep | null;
  isAnimated?: boolean;
  isFinished?: boolean;
  failureReason?: string;
}

export default function ProgressStep({
  step,
  isFinished,
  failureReason,
}: ProgressStepProps) {
  const truncatedStepName = useResponsiveTruncation(step?.name || "", {
    mobileS: 30,
    mobileM: 40,
    mobileL: 50,
  });
  console.log({ step, isFinished, failureReason });

  if (isFinished) {
    return (
      <div className="flex items-center gap-2 rounded-lg p-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm">
              {failureReason
                ? `Report generation failed: ${failureReason}`
                : "Report generated"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!step) return null;

  return (
    <div className="flex items-center gap-2 rounded-lg p-3">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm">{truncatedStepName}</span>
        </div>
      </div>
    </div>
  );
}
