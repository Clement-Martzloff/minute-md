"use client";

import ProgressTimer from "@/src/app/components/progress-tracker/progress-timer/ProgressTimer";
import { useReportStore } from "@/src/lib/store/useReportStore";

export default function ProgressTimerIndex() {
  const elapsedTime = useReportStore((state) => state.elapsedTime);

  return <ProgressTimer elapsedTime={elapsedTime} />;
}
