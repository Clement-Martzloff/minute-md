"use client";

import MarkdownActions from "@/src/app/project/components/markdown-streamer/MarkdownActions";
import MarkdownHeader from "@/src/app/project/components/markdown-streamer/MarkdownHeader";
import MarkdownStats from "@/src/app/project/components/markdown-streamer/MarkdownStats";
import StreamingTextArea from "@/src/app/project/components/markdown-streamer/StreamingTextArea";

interface MarkdownStreamerProps {
  content: string;
  title?: string;
  isStreaming?: boolean;
}

export default function MarkdownStreamer({
  content,
  title,
  isStreaming = false,
}: MarkdownStreamerProps) {
  const wordCount = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_0px_#000] overflow-hidden">
      <MarkdownHeader
        title={title}
        isStreaming={isStreaming}
        wordCount={wordCount}
      />

      <StreamingTextArea content={content} />

      <MarkdownStats content={content} />

      <MarkdownActions
        content={content}
        onCopy={() => console.log("Copied!")}
        onDownload={() => console.log("Downloaded!")}
        onShare={() => console.log("Shared!")}
      />
    </div>
  );
}
