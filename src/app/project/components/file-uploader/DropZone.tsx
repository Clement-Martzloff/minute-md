"use client";

import { Button } from "@/src/components/ui/button";
import { Plus, Upload } from "lucide-react";
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
      className={`
        relative border-4 border-dashed rounded-none p-8 mb-6 transition-all duration-200
        ${
          isDragOver
            ? "border-pink-500 bg-pink-100 shadow-[8px_8px_0px_0px_#ec4899]"
            : "border-gray-400 bg-yellow-100 shadow-[8px_8px_0px_0px_#6b7280] hover:shadow-[12px_12px_0px_0px_#6b7280]"
        }
      `}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="text-center">
        <div className="mb-4">
          <Upload className="w-16 h-16 mx-auto text-gray-600" strokeWidth={3} />
        </div>
        <p className="text-xl font-black text-gray-800 mb-2">
          DRAG & DROP FILES HERE
        </p>
        <p className="text-sm font-bold text-gray-600 mb-4">
          or click the button below
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
          className="bg-lime-400 hover:bg-lime-500 text-black font-black text-lg px-8 py-3 rounded-none shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transition-all duration-200 border-2 border-black"
        >
          <label
            htmlFor="file-input"
            className="cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-5 h-5" strokeWidth={3} />
            BROWSE FILES
          </label>
        </Button>
      </div>
    </div>
  );
}
