import ProgressTimer from "@/src/app/components/progress-tracker/ProgressTimer";
import TypingDots from "@/src/app/components/progress-tracker/TypingDots";
import { Sparkles } from "lucide-react";

interface ProgressHeaderProps {
  mainStatus: string;
  isRunning: boolean;
  elapsedTime: number;
}

export default function ProgressHeader({
  mainStatus,
  isRunning,
  elapsedTime,
}: ProgressHeaderProps) {
  return (
    <div className="border-border flex items-center justify-between border-b-2 p-4">
      <div className="flex items-center space-x-3">
        <Sparkles className="h-5 w-5" strokeWidth={2} />
        <span className="text-lg tracking-tight">{mainStatus}&nbsp;</span>
        {isRunning && <TypingDots />}
      </div>
      <ProgressTimer elapsedTime={elapsedTime} />
    </div>
  );
}
