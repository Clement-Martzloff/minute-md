"use client";

import DropZone from "@/src/app/components/file-uploader/DropZone";
import ErrorMessage from "@/src/app/components/file-uploader/ErrorMessage";
import FileList from "@/src/app/components/file-uploader/FileList";
import type {
  FileItem,
  FileValidationResult,
} from "@/src/app/components/file-uploader/types";
import { Button } from "@/src/components/ui/button";
import { useReportPipeline } from "@/src/lib/hooks/useReportPipeline";
import { ArrowRight } from "lucide-react";
import type React from "react";
import { useCallback, useState } from "react";

const validateFile = (file: File): FileValidationResult => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain",
  ];

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File "${file.name}" is too large. Maximum size is 10MB.`,
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File "${file.name}" is not supported. Only PDF, DOCX, and TXT files are allowed.`,
    };
  }

  return { isValid: true };
};

export default function FileUploader() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { pipelineState, addFiles, processFiles, removeFile, sources } =
    useReportPipeline();

  const handleFiles = useCallback(
    (fileList: FileList) => {
      setError(null);
      const newFiles: FileItem[] = [];
      const errors: string[] = [];

      Array.from(fileList).forEach((file) => {
        const validation = validateFile(file);
        if (!validation.isValid && validation.error) {
          errors.push(validation.error);
        } else {
          newFiles.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            type: file.type,
            file,
          });
        }
      });

      if (errors.length > 0) {
        setError(errors.join(" "));
      }

      if (newFiles.length > 0) {
        addFiles(newFiles);
      }
    },
    [addFiles],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = "";
    },
    [handleFiles],
  );

  const handleProcessFiles = useCallback(() => {
    const rawFiles = sources
      .map((source) => source.file)
      .filter(Boolean) as File[];

    if (processFiles) {
      processFiles(rawFiles);
    }
  }, [sources, processFiles]);

  return (
    <div className="bg-card border-border mx-4 max-w-2xl space-y-6 rounded-xl p-6 shadow-xl md:mx-auto md:w-full">
      <DropZone
        isDragOver={isDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onFileSelect={handleFileInput}
      />

      {error && <ErrorMessage message={error} />}

      <FileList files={sources} onRemoveFile={removeFile} />

      {sources.length > 0 && (
        <div className="flex">
          <Button
            className="bg-primary text-background cursor-pointer shadow-xl"
            onClick={handleProcessFiles}
            size="lg"
            disabled={pipelineState.isRunning}
          >
            <span className="font-semibold tracking-wide">
              {pipelineState.isRunning ? "Processing..." : "Create Report"}
            </span>
            <ArrowRight />
          </Button>
        </div>
      )}
    </div>
  );
}
