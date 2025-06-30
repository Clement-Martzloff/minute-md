"use client";

import DropZone from "@/src/app/project/components/file-uploader/DropZone";
import ErrorMessage from "@/src/app/project/components/file-uploader/ErrorMessage";
import FileList from "@/src/app/project/components/file-uploader/FileList";
import type {
  FileItem,
  FileValidationResult,
} from "@/src/app/project/components/file-uploader/types";
import { Button } from "@/src/components/ui/button";
import type React from "react";
import { useCallback, useState } from "react";

interface FileUploaderProps {
  files: FileItem[];
  onAddFiles: (newFiles: FileItem[]) => void;
  onRemoveFile: (id: string) => void;
  onClearFiles: () => void;
  onProcessFiles?: (files: File[]) => Promise<void>;
}

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

export default function FileUploader({
  files,
  onAddFiles,
  onRemoveFile,
  onClearFiles,
  onProcessFiles,
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        onAddFiles(newFiles);
      }
    },
    [onAddFiles]
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
    [handleFiles]
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
    [handleFiles]
  );

  const handleProcessFiles = useCallback(() => {
    const rawFiles = files
      .map((source) => source.file)
      .filter(Boolean) as File[];

    if (onProcessFiles) {
      onProcessFiles(rawFiles);
    }
  }, [files, onProcessFiles]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <DropZone
        isDragOver={isDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onFileSelect={handleFileInput}
      />

      {error && <ErrorMessage message={error} />}

      <FileList files={files} onRemoveFile={onRemoveFile} />

      {files.length > 0 && (
        <div className="mt-4 flex justify-end space-x-2">
          <Button onClick={onClearFiles} variant="outline">
            Clear All
          </Button>
          <Button onClick={handleProcessFiles}>Process Selected Files</Button>
        </div>
      )}
    </div>
  );
}
