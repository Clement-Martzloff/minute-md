"use client";

import FilesDropzone from "@/src/app/components/files-dropzone/FilesDropzone";
// import Hero from "@/src/app/components/Hero";
import GenerateReport from "@/src/app/components/generate-report/GenerateReport";
import MarkdownStreamer from "@/src/app/components/markdown-streamer/MarkdownStreamer";
import ProgressTracker from "@/src/app/components/progress-tracker/ProgressTracker";
import SelectedFiles from "@/src/app/components/selected-files/SelectedFiles";
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
    <div className="mx-4 mt-6 max-w-2xl space-y-6" ref={scrollContainerRef}>
      {/* <Hero /> */}
      <FilesDropzone />
      <SelectedFiles />
      <GenerateReport />
      <ProgressTracker />
      <MarkdownStreamer />
      <div ref={bottomRef}></div>
    </div>
  );
}
