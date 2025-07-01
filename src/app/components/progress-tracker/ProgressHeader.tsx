import ProgressTimer from "@/src/app/components/progress-tracker/ProgressTimer";
import TypingDots from "@/src/app/components/progress-tracker/TypingDots";
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
    <div className="flex items-center justify-between border-b-4 border-black p-4">
      <div className="flex items-center space-x-3">
        <div
          className={`rounded-none border-2 border-black p-2 shadow-[2px_2px_0px_0px_#000] ${getStatusColor(
            mainStatus,
          )}`}
        >
          <Sparkles className="h-5 w-5 text-black" strokeWidth={2} />
        </div>
        <div className="flex items-center">
          <span className="hidden text-xl font-black tracking-tight text-black uppercase md:block">
            {mainStatus}
          </span>
          {isRunning && <TypingDots />}
        </div>
      </div>
      <ProgressTimer elapsedTime={elapsedTime} />
    </div>
  );
}
