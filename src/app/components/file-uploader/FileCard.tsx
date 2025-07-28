"use client";

import type { FileItem } from "@/src/app/components/file-uploader/types";
import { Button } from "@/src/components/ui/button";
import { useResponsiveTruncation } from "@/src/lib/hooks/useResponsiveTruncation";
import { X } from "lucide-react";

interface FileCardProps {
  file: FileItem;
  onRemove: (id: string) => void;
}

export default function FileCard({ file, onRemove }: FileCardProps) {
  const truncatedFileName = useResponsiveTruncation(file.name);

  return (
    <div className="border-border flex items-center justify-between rounded-lg border-2 p-2">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <p className="text-foreground text-sm tracking-tight">
            {truncatedFileName}
          </p>
        </div>
      </div>

      <Button
        onClick={() => onRemove(file.id)}
        className="bg-destructive cursor-pointer p-1 font-bold shadow-md"
        size="none"
      >
        <X strokeWidth={3} />
      </Button>
    </div>
  );
}
