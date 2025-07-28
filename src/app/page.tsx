"use client";

import FileUploader from "@/src/app/components/file-uploader/FileUploader";
import Hero from "@/src/app/components/Hero";
import MarkdownStreamer from "@/src/app/components/markdown-streamer/MarkdownStreamer";
import ProgressTracker from "@/src/app/components/progress-tracker/ProgressTracker";
import useScrollToBottom from "@/src/lib/hooks/useScrollToBottom";
import { useRef } from "react";

export default function HomePage() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useScrollToBottom(scrollContainerRef, bottomRef);

  return (
    <div
      className="space-y-6 bg-gradient-to-br from-orange-100 via-pink-100 to-red-100"
      ref={scrollContainerRef}
    >
      <Hero />
      <FileUploader />
      <ProgressTracker />
      <MarkdownStreamer />
      <div ref={bottomRef}></div>
    </div>
  );
}
