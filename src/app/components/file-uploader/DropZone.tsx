"use client";

import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
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
      className={cn(
        isDragOver ? "border-border bg-accent" : "border-border",
        "rounded-lg border-2 border-dashed p-6 transition-all duration-200",
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="space-y-4 text-center">
        <div>
          <Upload
            className="text-foreground mx-auto h-10 w-10"
            strokeWidth={3}
          />
        </div>
        <p className="text-foreground text-xl leading-tight tracking-tight">
          Drop files here
        </p>
        <p className="text-foreground/50 text-sm leading-tight">
          (or click below)
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
          className="text-secondary-foreground cursor-pointer shadow-lg"
          variant="secondary"
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
