import ProgressTimer from "@/src/app/components/progress-tracker/ProgressTimer";
import TypingDots from "@/src/app/components/progress-tracker/TypingDots";
import { useReportState } from "@/src/lib/hooks/useReportState";
import { Sparkle } from "lucide-react";

export default function ProgressHeader() {
  const { pipelineState } = useReportState();

  return (
    <div className="border-border flex items-center justify-between border-b-1 p-3">
      <div className="flex items-center gap-1.5">
        <Sparkle className="h-4 w-4" strokeWidth={2} />
        <span className="font-semibold">{pipelineState.mainStatus}&nbsp;</span>
        {pipelineState.isRunning && <TypingDots />}
      </div>
      <ProgressTimer />
    </div>
  );
}
