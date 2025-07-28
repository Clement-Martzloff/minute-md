"use client";

import GenerateReportButton from "@/src/app/components/generate-report/GenerateReportButton";
import { useReportFiles } from "@/src/lib/hooks/useReportFiles";

export default function GenerateReport() {
  const { sources } = useReportFiles();

  if (sources.length === 0) return null;

  return <GenerateReportButton />;
}
