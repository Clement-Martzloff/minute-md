"use client";

import type { FileItem } from "@/src/app/components/files-dropzone/types";
import { Button } from "@/src/components/ui/button";
import { useReportFiles } from "@/src/lib/hooks/useReportFiles";
import { useResponsiveTruncation } from "@/src/lib/hooks/useResponsiveTruncation";
import { FileText, X } from "lucide-react";

interface FileCardProps {
  file: FileItem;
}

export default function FileCard({ file }: FileCardProps) {
  const { removeFile } = useReportFiles();

  const truncatedFileName = useResponsiveTruncation(file.name, {
    mobileS: 30,
    mobileM: 40,
    mobileL: 50,
  });

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <FileText className="h-5 w-5" />
        <p className="text-sm">{truncatedFileName}</p>
      </div>

      <Button
        onClick={() => removeFile(file.id)}
        className="bg-destructive cursor-pointer p-0.5"
        size="none"
      >
        <X strokeWidth={3} />
      </Button>
    </div>
  );
}
