"use client";

import FileUploader from "@/src/app/components/file-uploader/FileUploader";
import type { FileItem } from "@/src/app/components/file-uploader/types";
import Hero from "@/src/app/components/Hero";
import MarkdownStreamer from "@/src/app/components/markdown-streamer/MarkdownStreamer";
import ProgressTracker from "@/src/app/components/progress-tracker/ProgressTracker";
import type { ProgressEvent } from "@/src/app/components/progress-tracker/types";
import { usePipelineState } from "@/src/lib/hooks/usePipelineState";
import { useCallback, useEffect, useRef, useState } from "react";

const initialDummyFiles: FileItem[] = [];

export default function Page() {
  const [events, setEvents] = useState<ProgressEvent[]>([]);
  const [sources, setSources] = useState<FileItem[]>(initialDummyFiles);
  const [markdownContent, setMarkdownContent] = useState<string>("");

  const { pipelineState, setIsApiRequestPending } = usePipelineState(events);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observerTarget = scrollContainerRef.current;
    const bottom = bottomRef.current;

    if (!observerTarget || !bottom) return;

    const observer = new MutationObserver(() => {
      bottom.scrollIntoView({ behavior: "smooth" });
    });

    observer.observe(observerTarget, {
      childList: true,
      subtree: true,
      // characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  const handleAddFiles = useCallback((newFiles: FileItem[]) => {
    setSources((prevSources) => {
      const existingSourceIds = new Set(prevSources.map((source) => source.id));
      const sourcesToAdd = newFiles.filter(
        (source) => !existingSourceIds.has(source.id),
      );
      return [
        ...prevSources,
        ...sourcesToAdd.map((source) => ({
          ...source,
          selected: true,
        })),
      ];
    });
  }, []);

  const handleRemoveFile = useCallback((id: string) => {
    setSources((prevSources) =>
      prevSources.filter((source) => source.id !== id),
    );
  }, []);

  const handleClearFiles = useCallback(() => {
    setSources([]);
  }, []);

  const handleProcessFiles = useCallback(
    async (files: File[]) => {
      setEvents([]); // Clear events for a new process
      setMarkdownContent(""); // Clear markdown report for a new process

      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      setIsApiRequestPending(true);

      try {
        const response = await fetch("/api/meeting-report", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", errorData.error);
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
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const events = chunk.split("\n\n").filter(Boolean);

          for (const event of events) {
            if (event.startsWith("data: ")) {
              const data: ProgressEvent = JSON.parse(event.substring(6));
              setEvents((prev) => [...prev, data]);

              if (
                data.type === "step-chunk" &&
                data.stepName === "markdown-generation" &&
                typeof data.chunk === "string"
              ) {
                setMarkdownContent((prev) => prev + data.chunk);
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to process files:", error);
      } finally {
        setIsApiRequestPending(false);
      }
    },
    [setIsApiRequestPending],
  );

  return (
    <div
      ref={scrollContainerRef}
      className="space-y-6 bg-gradient-to-br from-orange-100 via-pink-100 to-red-100"
    >
      <Hero />
      <FileUploader
        files={sources}
        onAddFiles={handleAddFiles}
        onRemoveFile={handleRemoveFile}
        onClearFiles={handleClearFiles}
        onProcessFiles={handleProcessFiles}
        events={events}
        isApiRequestPending={pipelineState.isApiRequestPending}
      />
      <ProgressTracker events={events} />
      {markdownContent && <MarkdownStreamer content={markdownContent} />}
      <div ref={bottomRef} />
    </div>
  );
}
