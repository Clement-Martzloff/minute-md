"use client";

import FileIcon from "@/src/app/project/components/file-uploader/FileIcon";
import type { FileItem } from "@/src/app/project/components/file-uploader/types";
import { Button } from "@/src/components/ui/button";
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
  if (type.includes("pdf")) return "bg-red-400";
  if (type.includes("word") || type.includes("document")) return "bg-blue-400";
  if (type.includes("text")) return "bg-green-400";
  return "bg-purple-400";
};

export default function FileCard({ file, onRemove }: FileCardProps) {
  return (
    <div
      className={`
        flex items-center justify-between p-4 rounded-none border-4 border-black
        ${getFileColor(file.type)} shadow-[6px_6px_0px_0px_#000]
        hover:shadow-[8px_8px_0px_0px_#000] transition-all duration-200
      `}
    >
      <div className="flex items-center gap-4">
        <div className="bg-white p-2 rounded-none border-2 border-black shadow-[2px_2px_0px_0px_#000]">
          <FileIcon type={file.type} />
        </div>
        <div>
          <p className="font-black text-black text-lg leading-tight">
            {file.name}
          </p>
          <p className="font-bold text-black text-sm opacity-80">
            {formatFileSize(file.size)}
          </p>
        </div>
      </div>

      <Button
        onClick={() => onRemove(file.id)}
        className="bg-red-500 hover:bg-red-600 text-white font-black p-2 rounded-none shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] transition-all duration-200 border-2 border-black"
        size="sm"
      >
        <X className="w-4 h-4" strokeWidth={3} />
      </Button>
    </div>
  );
}
