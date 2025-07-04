"use client";

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
  const scrollRef = useRef<HTMLPreElement>(null);

  // Auto-scroll to bottom only when content overflows the container
  useEffect(() => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current;

      // Only scroll to bottom if content exceeds container height
      if (scrollHeight > clientHeight) {
        scrollRef.current.scrollTop = scrollHeight;
      }
    }
  }, [content]);

  return (
    <div className="bg-white">
      <pre
        ref={scrollRef}
        className={cn(
          `${className}`,
          "scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 h-96 overflow-y-auto rounded-none border-2 border-gray-300 bg-gray-50 p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap",
        )}
      >
        <code className="text-gray-800">{content}</code>
        {content && (
          <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-black align-middle" />
        )}
      </pre>
    </div>
  );
}
