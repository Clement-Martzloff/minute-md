"use client";

import FilesDropzone from "@/src/app/components/files-dropzone";
import GenerateReport from "@/src/app/components/generate-report";
import Hero from "@/src/app/components/Hero";
import MarkdownStreamer from "@/src/app/components/markdown-streamer";
import ProgressTracker from "@/src/app/components/progress-tracker";
import { useReportStore } from "@/src/lib/store/useReportStore";
import { useEffect, useRef } from "react";

const scrollOptions = {
  behavior: "smooth",
  block: "end",
  inline: "nearest",
} as ScrollOptions;

export default function HomePage() {
  const sources = useReportStore((state) => state.sources);
  const status = useReportStore((state) => state.status);
  const stepName = useReportStore((state) => state.stepName);

  const generateReportRef = useRef<HTMLDivElement>(null);
  const progressTrackerRef = useRef<HTMLDivElement>(null);
  const markdownStreamerRef = useRef<HTMLDivElement>(null);

  const isAtLeastOneSource = sources.length > 0;
  const isFinished = status === "finished";
  const isMarkdownGeneration = stepName === "markdown-generation";
  const isPending = status === "pending";
  const isRunning = status === "running";

  useEffect(() => {
    const element = generateReportRef.current;
    if (element) element.scrollIntoView(scrollOptions);
  }, [sources.length]);

  useEffect(() => {
    let element: HTMLDivElement | null = null;

    if (isRunning && isMarkdownGeneration) {
      element = markdownStreamerRef.current;
    } else if (isRunning) {
      element = progressTrackerRef.current;
    }

    if (element) element.scrollIntoView(scrollOptions);
  }, [isRunning, isMarkdownGeneration]);

  return (
    <div className="mx-4 mt-6 max-w-lg space-y-6 md:mx-auto">
      <Hero />
      <FilesDropzone />
      {isAtLeastOneSource ? <GenerateReport ref={generateReportRef} /> : null}
      {!isPending ? <ProgressTracker ref={progressTrackerRef} /> : null}
      {isMarkdownGeneration || isFinished ? (
        <MarkdownStreamer ref={markdownStreamerRef} />
      ) : null}
    </div>
  );
}
