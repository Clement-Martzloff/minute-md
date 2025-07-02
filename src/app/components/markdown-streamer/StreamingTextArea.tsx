"use client";

import { useLayoutEffect, useRef } from "react";

interface StreamingTextAreaProps {
  content: string;
  maxHeight?: string;
  className?: string;
}

export default function StreamingTextArea({
  content,
  maxHeight = "60vh",
  className = "",
}: StreamingTextAreaProps) {
  const preRef = useRef<HTMLPreElement>(null);

  // Auto-scroll logic - only scroll if user was near bottom
  useLayoutEffect(() => {
    const element = preRef.current;
    if (!element) return;

    const scrollBuffer = 20;
    const isScrolledToBottom =
      element.scrollHeight - element.scrollTop <=
      element.clientHeight + scrollBuffer;

    if (isScrolledToBottom) {
      element.scrollTop = element.scrollHeight;
    }
  }, [content]);

  return (
    <div className="bg-white">
      <pre
        ref={preRef}
        className={`scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 overflow-y-auto rounded-none border-2 border-gray-300 bg-gray-50 p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap shadow-inner ${className} `}
        style={{ maxHeight }}
      >
        <code className="text-gray-800">{content}</code>
        {content && (
          <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-black align-middle" />
        )}
      </pre>
    </div>
  );
}
