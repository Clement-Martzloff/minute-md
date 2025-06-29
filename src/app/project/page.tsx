"use client";

import FileUploader from "@/src/app/project/components/file-uploader/FileUploader";
import type { FileItem } from "@/src/app/project/components/file-uploader/types";
import { useCallback } from "react";

const initialDummyFiles: FileItem[] = [
  {
    id: "dummy-1",
    name: "dummy-meeting-notes.pdf",
    size: 1024,
    type: "application/pdf",
    file: new File(
      ["This is a dummy PDF file content."],
      "dummy-meeting-notes.pdf",
      { type: "application/pdf" }
    ),
  },
  {
    id: "dummy-2",
    name: "dummy-agenda.docx",
    size: 2048,
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    file: new File(
      ["This is a dummy DOCX file content."],
      "dummy-agenda.docx",
      {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }
    ),
  },
  {
    id: "dummy-3",
    name: "dummy-report.txt",
    size: 512,
    type: "text/plain",
    file: new File(["This is a dummy TXT file content."], "dummy-report.txt", {
      type: "text/plain",
    }),
  },
];

export default function Page() {
  const handleProcessFiles = useCallback(async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("/api/meeting-report", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData.error);
        // Handle error display in UI
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        console.error("No readable stream from response.");
        return;
      }

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("Stream complete.");
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        // Assuming each chunk is a complete SSE data event
        const events = chunk.split("\n\n").filter(Boolean);
        for (const event of events) {
          if (event.startsWith("data: ")) {
            const data = JSON.parse(event.substring(6));
            console.log("Received event:", data);
            // Update UI based on event data
          }
        }
      }
    } catch (error) {
      console.error("Failed to process files:", error);
      // Handle network or other unexpected errors
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-100 to-red-100">
      <FileUploader
        initialFiles={initialDummyFiles}
        onProcessFiles={handleProcessFiles}
      />
    </div>
  );
}
