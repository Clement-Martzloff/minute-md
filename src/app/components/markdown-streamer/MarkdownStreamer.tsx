"use client";

import MarkdownHeader from "@/src/app/components/markdown-streamer/MarkdownHeader";
import StreamingTextArea from "@/src/app/components/markdown-streamer/StreamingTextArea";
import { useReportPipeline } from "@/src/lib/hooks/useReportPipeline";
import { useState } from "react";

export default function MarkdownStreamer() {
  const { markdownContent } = useReportPipeline();
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
    <div className="mx-4 max-w-2xl overflow-hidden rounded-none border-4 border-black bg-white shadow-[8px_8px_0px_0px_#000] md:mx-auto md:w-full">
      <MarkdownHeader onCopy={handleCopy} copyButtonLabel={copyButtonLabel} />
      <StreamingTextArea content={markdownContent} />
    </div>
  );
}
