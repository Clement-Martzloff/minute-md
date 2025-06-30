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
    <div className="p-4 bg-white">
      <pre
        ref={preRef}
        className={`
          whitespace-pre-wrap font-mono text-sm leading-relaxed
          overflow-y-auto border-2 border-gray-300 rounded-none
          p-4 bg-gray-50 shadow-inner
          scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200
          ${className}
        `}
        style={{ maxHeight }}
      >
        <code className="text-gray-800">{content}</code>
        {content && (
          <span className="inline-block w-2 h-4 bg-black animate-pulse ml-1 align-middle" />
        )}
      </pre>
    </div>
  );
}
