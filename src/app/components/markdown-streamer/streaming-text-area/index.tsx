"use client";

import StreamingTextArea from "@/src/app/components/markdown-streamer/streaming-text-area/StreamingTextArea";
import { useReportStore } from "@/src/lib/store/useReportStore";
import { useCallback, useEffect, useRef } from "react";

export default function StreamingTextAreaIndex() {
  const markdownContent = useReportStore((state) => state.markdownContent);
  const status = useReportStore((state) => state.status);

  const containerRef = useRef<HTMLDivElement>(null);
  const userHasScrolledUpRef = useRef(false);

  useEffect(() => {
    if (containerRef.current && !userHasScrolledUpRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [markdownContent]);

  useEffect(() => {
    if (status === "running") {
      userHasScrolledUpRef.current = false;
    }
  }, [status]);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      const isAtBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        5;
      userHasScrolledUpRef.current = !isAtBottom;
    }
  }, []);

  return (
    <StreamingTextArea
      markdownContent={markdownContent}
      containerRef={containerRef}
      handleScroll={handleScroll}
    />
  );
}
