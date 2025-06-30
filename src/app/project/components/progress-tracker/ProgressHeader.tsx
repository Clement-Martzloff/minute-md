import ProgressTimer from "@/src/app/project/components/progress-tracker/ProgressTimer";
import TypingDots from "@/src/app/project/components/progress-tracker/TypingDots";
import { Sparkles } from "lucide-react";

const getStatusColor = (status: string): string => {
  switch (status) {
    case "Complete":
      return "bg-green-400";
    case "Failed":
      return "bg-red-400";
    case "Thinking":
      return "bg-purple-400";
    default:
      return "bg-blue-400";
  }
};

const getStatusIcon = (status: string): string => {
  switch (status) {
    case "Complete":
      return "✅";
    case "Failed":
      return "❌";
    case "Thinking":
      return "🧠";
    default:
      return "⚡";
  }
};

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
    <div className="flex items-center justify-between p-4 border-b-4 border-black">
      <div className="flex items-center space-x-3">
        <div
          className={`p-2 rounded-none border-2 border-black shadow-[2px_2px_0px_0px_#000] ${getStatusColor(
            mainStatus
          )}`}
        >
          <Sparkles className="h-5 w-5 text-black" strokeWidth={3} />
        </div>
        <div className="flex items-center">
          <span className="font-black text-xl text-black tracking-tight">
            {getStatusIcon(mainStatus)} {mainStatus.toUpperCase()}
          </span>
          {isRunning && <TypingDots />}
        </div>
      </div>
      <ProgressTimer elapsedTime={elapsedTime} />
    </div>
  );
}
