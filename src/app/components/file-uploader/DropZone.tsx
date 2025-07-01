"use client";

import { Button } from "@/src/components/ui/button";
// import { Button } from "@/src/components/ui/button";
// import { Plus, Upload } from "lucide-react";
import { Upload } from "lucide-react";
import type React from "react";

interface DropZoneProps {
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DropZone({
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
}: DropZoneProps) {
  return (
    <div
      className={`relative rounded-none border-4 border-dashed p-4 transition-all duration-200 ${
        isDragOver
          ? // ? "border-pink-500 bg-pink-100 shadow-[8px_8px_0px_0px_#ec4899]"
            // : "border-gray-400 bg-yellow-100 shadow-[8px_8px_0px_0px_#6b7280] hover:shadow-[12px_12px_0px_0px_#6b7280]"
            "border-pink-500 bg-pink-100"
          : "border-gray-400 bg-white"
      } `}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="space-y-4 text-center">
        <div>
          <Upload className="mx-auto h-16 w-16 text-gray-600" strokeWidth={3} />
        </div>
        <p className="text-lg leading-tight font-bold text-gray-800 uppercase md:text-xl md:font-black">
          Drag and drop files here
        </p>
        <p className="text-sm leading-tight font-bold text-gray-600">
          (or click the button below)
        </p>

        <input
          type="file"
          multiple
          accept=".pdf,.docx,.doc,.txt"
          onChange={onFileSelect}
          className="hidden"
          id="file-input"
        />

        <Button
          asChild
          className="rounded-none border-2 border-black bg-white px-2 py-1 text-base font-bold text-black shadow-[4px_4px_0px_0px_#000] transition-all duration-200 hover:bg-lime-500 hover:shadow-[6px_6px_0px_0px_#000] md:px-6 md:py-3 md:text-xl"
          size="none"
        >
          <label
            htmlFor="file-input"
            className="flex cursor-pointer items-center gap-2"
          >
            {/* <Plus className="h-5 w-5" strokeWidth={3} /> */}
            Browse Files
          </label>
        </Button>
      </div>
    </div>
  );
}
