import type { ProgressStep } from "@/src/app/project/components/progress-tracker/types";
import { CheckCircle2, Loader2 } from "lucide-react";

interface ProgressStepProps {
  step: ProgressStep;
  isFinished: boolean;
  index: number;
}

export default function ProgressStepItem({
  step,
  isFinished,
  index,
}: ProgressStepProps) {
  const isRunning = step.status === "running" && !isFinished;
  const isCompleted = step.status === "completed" || isFinished;

  return (
    <li
      className="flex items-center gap-4 p-3 bg-white border-2 border-black rounded-none shadow-[3px_3px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] transition-all duration-200"
      style={{
        animationFillMode: "backwards",
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div
        className={`p-2 rounded-none border-2 border-black shadow-[1px_1px_0px_0px_#000] ${
          isCompleted ? "bg-green-400" : "bg-orange-400"
        }`}
      >
        {isRunning ? (
          <Loader2
            className="h-4 w-4 animate-spin text-black"
            strokeWidth={3}
          />
        ) : (
          <CheckCircle2 className="h-4 w-4 text-black" strokeWidth={3} />
        )}
      </div>

      <div className="flex-1">
        <span
          className={`font-black text-black text-sm tracking-tight ${
            isCompleted ? "opacity-100" : "opacity-80"
          }`}
        >
          {step.name.toUpperCase()}
        </span>
        {isRunning && (
          <div className="mt-1">
            <div className="w-full bg-gray-200 border border-black rounded-none h-2">
              <div
                className="bg-orange-400 h-full rounded-none animate-pulse border-r border-black"
                style={{ width: "60%" }}
              />
            </div>
          </div>
        )}
      </div>

      <div
        className={`px-2 py-1 border border-black rounded-none text-xs font-black ${
          isCompleted
            ? "bg-green-200 text-green-800"
            : "bg-orange-200 text-orange-800"
        }`}
      >
        {isCompleted ? "DONE" : "WORKING"}
      </div>
    </li>
  );
}
