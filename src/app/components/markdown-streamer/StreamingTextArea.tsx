import { cn } from "@/src/lib/utils";
import React from "react";

interface StreamingTextAreaProps {
  content: string;
  className?: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function StreamingTextArea({
  content,
  className = "",
  containerRef,
}: StreamingTextAreaProps) {
  return (
    <div ref={containerRef} className={cn(className)}>
      <pre className="font-mono text-sm break-words whitespace-pre-wrap">
        <code>{content}</code>
      </pre>
    </div>
  );
}
