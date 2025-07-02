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
    <div className="flex items-center justify-between rounded-none border-2 border-black p-2 shadow-[3px_3px_0px_0px_#000]">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <p className="font-bold tracking-tight text-black">
            {truncatedFileName}
          </p>
        </div>
      </div>

      <Button
        onClick={() => onRemove(file.id)}
        className="cursor-pointer rounded-none border-2 border-black bg-red-500 p-1 font-bold text-white shadow-[2px_2px_0px_0px_#000] transition-all duration-200 hover:bg-red-500 hover:shadow-[3px_3px_0px_0px_#000]"
        size="none"
      >
        <X strokeWidth={3} />
      </Button>
    </div>
  );
}
