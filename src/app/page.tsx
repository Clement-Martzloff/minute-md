"use client";

import FilesDropzone from "@/src/app/components/files-dropzone";
import GenerateReport from "@/src/app/components/generate-report";
import Hero from "@/src/app/components/Hero";
import MarkdownStreamer from "@/src/app/components/markdown-streamer";
import ProgressTracker from "@/src/app/components/progress-tracker";
import SelectedFiles from "@/src/app/components/selected-files";
import { useEffect, useRef } from "react";

export default function HomePage() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observerTarget = scrollContainerRef.current;
    const bottom = bottomRef.current;

    if (!observerTarget || !bottom) return;

    const observer = new MutationObserver(() => {
      setTimeout(() => bottom.scrollIntoView({ behavior: "smooth" }), 0);
    });

    observer.observe(observerTarget, {
      childList: true,
      subtree: true,
      characterData: false,
    });

    return () => observer.disconnect();
  }, [scrollContainerRef, bottomRef]);
  return (
    <div
      className="mx-4 mt-6 max-w-lg space-y-6 md:mx-auto"
      ref={scrollContainerRef}
    >
      <Hero />
      <FilesDropzone />
      <SelectedFiles />
      <GenerateReport />
      <ProgressTracker />
      <MarkdownStreamer />
      <div ref={bottomRef}></div>
    </div>
  );
}
