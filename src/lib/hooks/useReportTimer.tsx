import { ReportTimerContext } from "@/src/lib/context/ReportPipelineContext";
import { useContext } from "react";

export function useReportTimer() {
  const context = useContext(ReportTimerContext);
  if (!context) {
    throw new Error(
      "useReportTimer must be used within a ReportPipelineProvider",
    );
  }
  return context;
}
