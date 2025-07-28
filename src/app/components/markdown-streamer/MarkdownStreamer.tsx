"use client";

import MarkdownHeader from "@/src/app/components/markdown-streamer/MarkdownHeader";
import StreamingTextArea from "@/src/app/components/markdown-streamer/StreamingTextArea";
import { useReportState } from "@/src/lib/hooks/useReportState";
import { useState } from "react";

export default function MarkdownStreamer() {
  const { markdownContent } = useReportState();
  const [copyButtonLabel, setCopyButtonLabel] = useState("Copy");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopyButtonLabel("Copied !");
      setTimeout(() => {
        setCopyButtonLabel("Copy");
      }, 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  if (!markdownContent) return null;

  return (
    <div className="flex-col space-y-3 overflow-hidden">
      <MarkdownHeader onCopy={handleCopy} copyButtonLabel={copyButtonLabel} />
      <StreamingTextArea content={markdownContent} />
    </div>
  );
}
