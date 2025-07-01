"use client";

// import FileIcon from "@/src/app/components/file-uploader/FileIcon";
import type { FileItem } from "@/src/app/components/file-uploader/types";
import { Button } from "@/src/components/ui/button";
import { useResponsiveTruncation } from "@/src/lib/hooks/useResponsiveTruncation";
import { X } from "lucide-react";

interface FileCardProps {
  file: FileItem;
  onRemove: (id: string) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
};

const getFileColor = (type: string): string => {
  if (type.includes("pdf")) return "bg-white";
  if (type.includes("word") || type.includes("document")) return "bg-white";
  if (type.includes("text")) return "bg-white";
  return "bg-purple-400";
};

export default function FileCard({ file, onRemove }: FileCardProps) {
  const truncatedFileName = useResponsiveTruncation(file.name);

  return (
    <div
      className={`flex items-center justify-between rounded-none border-3 border-black p-2 md:p-4 ${getFileColor(file.type)} shadow-[4px_4px_0px_0px_#000] transition-all duration-200 hover:shadow-[6px_6px_0px_0px_#000]`}
    >
      <div className="flex items-center gap-4">
        {/* <div className="rounded-none border-2 border-black bg-white p-2 shadow-[2px_2px_0px_0px_#000]">
          <FileIcon type={file.type} />
        </div> */}
        <div className="flex flex-col">
          <p className="text-md font-bold text-black">{truncatedFileName}</p>
          <p className="text-sm font-bold text-black opacity-80">
            {formatFileSize(file.size)}
          </p>
        </div>
      </div>

      <Button
        onClick={() => onRemove(file.id)}
        className="rounded-none border-2 border-black bg-red-500 p-1 font-black text-white shadow-[2px_2px_0px_0px_#000] transition-all duration-200 hover:bg-red-600 hover:shadow-[3px_3px_0px_0px_#000]"
        size="none"
      >
        <X strokeWidth={4} />
      </Button>
    </div>
  );
}
