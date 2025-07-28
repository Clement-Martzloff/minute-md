import { ReportStateContext } from "@/src/lib/context/ReportPipelineContext";
import { useContext } from "react";

export function useReportState() {
  const context = useContext(ReportStateContext);
  if (!context) {
    throw new Error(
      "useReportState must be used within a ReportPipelineProvider",
    );
  }
  return context;
}
