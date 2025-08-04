"use client";

import ErrorMessage from "@/src/app/components/files-dropzone/ErrorMessage";
import type { FileItem } from "@/src/app/components/files-dropzone/types";
import { validateFile } from "@/src/app/components/files-dropzone/utils";
import { Button } from "@/src/components/ui/button";
import { useReportStore } from "@/src/lib/store/useReportStore";
import { cn } from "@/src/lib/utils";
import { Upload } from "lucide-react";
import { useCallback, useState } from "react";

export default function FilesDropzoneIndex() {
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const addFiles = useReportStore((state) => state.addFiles);

  const handleFilesSelected = useCallback(
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
            // A slightly more robust unique ID
            id: `${file.name}-${file.lastModified}-${file.size}`,
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
    [addFiles], // This dependency is stable because Zustand actions don't change.
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
        handleFilesSelected(files);
      }
    },
    [handleFilesSelected],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFilesSelected(files);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = "";
    },
    [handleFilesSelected],
  );

  return (
    <div className="md:mx-auto md:w-full">
      <div
        className={cn(
          isDragOver ? "border-accent border-3" : "border-border",
          "bg-primary-foreground rounded-lg border-2 border-dashed p-6 transition-all duration-200",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload
            className="text-foreground mx-auto h-10 w-10"
            strokeWidth={3}
          />

          <p className="mt-2">Glissez vos sources ici</p>
          <p className="text-sm">(ou cliquez en dessous)</p>

          <input
            type="file"
            multiple
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileInput}
            className="hidden"
            id="file-input"
          />

          <Button asChild className="mt-3 cursor-pointer" variant="secondary">
            <label htmlFor="file-input">Parcourir</label>
          </Button>
        </div>
      </div>
      <p className="mt-2 text-center text-xs">
        Fichiers acceptés : PDF, DOCX, TXT (max 10MB)
      </p>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
