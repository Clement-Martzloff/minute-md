"use client";

import ErrorMessage from "@/src/app/components/files-dropzone/ErrorMessage";
import type { FileItem } from "@/src/app/components/files-dropzone/types";
import { validateFile } from "@/src/app/components/files-dropzone/utils";
import { Button } from "@/src/components/ui/button";
import { useReportFiles } from "@/src/lib/hooks/useReportFiles";
import { cn } from "@/src/lib/utils";
import { Upload } from "lucide-react";
import { useCallback, useState } from "react";

export default function FilesDropzone() {
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const { addFiles } = useReportFiles();

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
    <div className="space-y-6 md:mx-auto md:w-full">
      <div
        className={cn(
          isDragOver ? "border-accent border-3" : "border-border",
          "rounded-lg border-2 border-dashed p-6 transition-all duration-200",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-3 text-center">
          <div>
            <Upload
              className="text-foreground mx-auto h-10 w-10"
              strokeWidth={3}
            />
          </div>
          <p>Drop files here</p>
          <p className="text-foreground/50 text-sm">(or click below)</p>

          <input
            type="file"
            multiple
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileInput}
            className="hidden"
            id="file-input"
          />

          <Button asChild className="cursor-pointer" variant="secondary">
            <label htmlFor="file-input">Browse Files</label>
          </Button>
        </div>
      </div>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
