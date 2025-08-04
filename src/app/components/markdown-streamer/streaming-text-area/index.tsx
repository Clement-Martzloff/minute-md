"use client";

import StreamingTextArea from "@/src/app/components/markdown-streamer/streaming-text-area/StreamingTextArea";
import { useReportStore } from "@/src/lib/store/useReportStore";
import { useCallback, useEffect, useRef } from "react";

export default function StreamingTextAreaIndex() {
  // 1. SELECT THE VALUES NEEDED FOR RENDERING
  // This component subscribes to BOTH markdownContent and status.
  // It will re-render if EITHER of them changes. Since markdownContent
  // changes constantly, this component will be "hot".
  const markdownContent = useReportStore((state) => state.markdownContent);
  const status = useReportStore((state) => state.status);

  // 2. SET UP REFS AND EFFECTS
  const containerRef = useRef<HTMLDivElement>(null);
  const userHasScrolledUpRef = useRef(false);

  // Auto-scroll when new content arrives
  useEffect(() => {
    if (containerRef.current && !userHasScrolledUpRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [markdownContent]); // Depends on the streaming content

  // Reset scroll lock when a new pipeline starts
  useEffect(() => {
    if (status === "running") {
      userHasScrolledUpRef.current = false;
    }
  }, [status]); // Depends on the pipeline status

  // Detect if the user has scrolled up to disable auto-scroll
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      const isAtBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        5;
      userHasScrolledUpRef.current = !isAtBottom;
    }
  }, []);

  // 3. RENDER THE CONTENT
  return (
    <StreamingTextArea
      markdownContent={markdownContent}
      containerRef={containerRef}
      handleScroll={handleScroll}
    />
  );
}
