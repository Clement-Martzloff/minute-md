import ProgressTimer from "@/src/app/components/progress-tracker/ProgressTimer";
import TypingDots from "@/src/app/components/progress-tracker/TypingDots";
import { Status } from "@/src/lib/context/types";
import { Sparkle } from "lucide-react";

interface ProgressHeaderProps {
  status: Status;
  failureReason?: string;
}

export default function ProgressHeader({
  status,
  failureReason,
}: ProgressHeaderProps) {
  const statusLabel = (() => {
    if (status === "pending") return "Waiting...";
    if (status === "running") return "Thinking";
    if (status === "finished") {
      return failureReason ? "Failed" : "Complete";
    }
    return "";
  })();

  return (
    <div className="border-border flex items-center justify-between border-b-1 p-3">
      <div className="flex items-center gap-1.5">
        <Sparkle className="h-4 w-4" strokeWidth={2} />
        <span className="font-semibold">{statusLabel}&nbsp;</span>
        {status === "running" && <TypingDots />}
      </div>
      <ProgressTimer />
    </div>
  );
}
