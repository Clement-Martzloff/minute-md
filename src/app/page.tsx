"use client";

import FilesDropzone from "@/src/app/components/files-dropzone";
import GenerateReport from "@/src/app/components/generate-report";
import Hero from "@/src/app/components/Hero";
import MarkdownStreamer from "@/src/app/components/markdown-streamer";
import ProgressTracker from "@/src/app/components/progress-tracker";
import SelectedFiles from "@/src/app/components/selected-files";
import { useEffect, useRef } from "react";

export default function HomePage() {
  const parentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = parentRef.current;
    if (!container) return;

    const isNearBottom = () => {
      return (
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100
      );
    };

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "childList" &&
          mutation.addedNodes.length > 0 &&
          isNearBottom()
        ) {
          const last = mutation.addedNodes[mutation.addedNodes.length - 1];
          if (last instanceof HTMLElement) {
            last.scrollIntoView({ behavior: "smooth", block: "end" });
          }
          break;
        }
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: false,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="mx-4 mt-6 max-w-lg space-y-6 md:mx-auto" ref={parentRef}>
      <Hero />
      <FilesDropzone />
      <SelectedFiles />
      <GenerateReport />
      <ProgressTracker />
      <MarkdownStreamer />
    </div>
  );
}
