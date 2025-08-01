import { ReportFilesContext } from "@/src/lib/context/ReportPipelineContext";
import { useContext } from "react";

export function useReportFiles() {
  const context = useContext(ReportFilesContext);
  if (!context) {
    throw new Error(
      "useReportFiles must be used within a ReportPipelineProvider",
    );
  }
  return context;
}
