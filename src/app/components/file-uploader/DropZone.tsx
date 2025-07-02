"use client";

import { Button } from "@/src/components/ui/button";
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
      className={`rounded-none border-4 border-dashed p-6 transition-all duration-200 ${
        isDragOver ? "border-pink-500 bg-pink-100" : "border-gray-400 bg-white"
      } `}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="space-y-4 text-center">
        <div>
          <Upload className="mx-auto h-12 w-12 text-gray-600" strokeWidth={3} />
        </div>
        <p className="text-xl leading-tight font-bold tracking-tight text-gray-800">
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
          className="cursor-pointer rounded-none border-3 border-black bg-white text-lg font-bold text-black shadow-[4px_4px_0px_0px_#000] transition-all duration-200 hover:bg-white hover:shadow-[6px_6px_0px_0px_#000]"
          size="lg"
        >
          <label
            htmlFor="file-input"
            className="flex cursor-pointer items-center gap-2"
          >
            Browse Files
          </label>
        </Button>
      </div>
    </div>
  );
}
