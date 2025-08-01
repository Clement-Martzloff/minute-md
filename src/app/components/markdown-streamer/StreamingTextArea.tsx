"use client";

import { scrollbarClasses } from "@/src/app/components/markdown-streamer/constants";
import { cn } from "@/src/lib/utils";
import { useEffect, useRef } from "react";

interface StreamingTextAreaProps {
  content: string;
  className?: string;
}

export default function StreamingTextArea({
  content,
  className = "",
}: StreamingTextAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when content updates
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [content]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "bg-primary-foreground h-96 overflow-y-auto rounded-md border p-4",
        scrollbarClasses,
        className,
      )}
    >
      <pre className="font-mono text-sm break-words whitespace-pre-wrap">
        <code>{content}</code>
      </pre>
    </div>
  );
}
