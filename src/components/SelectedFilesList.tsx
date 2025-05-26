"use client";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { type DriveFile } from "../types/drive";

interface SelectedFilesListProps {
  files: DriveFile[];
  removeSource: (id: string) => void;
  toggleSource: (id: string) => void;
  clearSources: () => void;
}

const SelectedFilesList: React.FC<SelectedFilesListProps> = ({
  files,
  removeSource,
  toggleSource,
  clearSources,
}) => {
  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>Selected Sources</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {files.length === 0 ? (
          <p className="text-center text-gray-500">No files selected yet.</p>
        ) : (
          <div className="space-y-4">
            {files.map((file: DriveFile) => (
              <div
                key={file.id}
                className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center space-x-3 flex-grow pr-2">
                  <Checkbox
                    id={`file-${file.id}`}
                    checked={file.selected}
                    onCheckedChange={() => toggleSource?.(file.id)}
                    disabled={!toggleSource}
                  />
                  {file.iconLink && (
                    <Image
                      src={file.iconLink}
                      alt={`${file.name} icon`}
                      width={20}
                      height={20}
                    />
                  )}
                  <label
                    htmlFor={`file-${file.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow truncate"
                  >
                    {file.name} ({file.mimeType})
                  </label>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSource?.(file.id)}
                  disabled={!removeSource}
                  className="flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="pt-4 border-t mt-4">
              <Button
                variant="outline"
                onClick={clearSources}
                disabled={!clearSources || files.length === 0}
                className="w-full"
              >
                Clear All Sources
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SelectedFilesList;
