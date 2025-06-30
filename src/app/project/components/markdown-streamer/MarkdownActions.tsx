"use client";

import { Button } from "@/src/components/ui/button";
import { Copy, Download, Share2 } from "lucide-react";

interface MarkdownActionsProps {
  content: string;
  onCopy?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

export default function MarkdownActions({
  content,
  onCopy,
  onDownload,
  onShare,
}: MarkdownActionsProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      onCopy?.();
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-report-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onDownload?.();
  };

  const handleShare = async () => {
    if (
      typeof navigator !== "undefined" &&
      "share" in navigator &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share({
          title: "AI Generated Report",
          text: content,
        });
        onShare?.();
      } catch (err) {
        console.error("Failed to share:", err);
      }
    }
  };

  if (!content.trim()) return null;

  return (
    <div className="p-4 bg-orange-200 border-t-4 border-black">
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          onClick={handleCopy}
          className="bg-blue-400 hover:bg-blue-500 text-black font-black px-4 py-2 rounded-none shadow-[3px_3px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] transition-all duration-200 border-2 border-black"
        >
          <Copy className="w-4 h-4 mr-2" strokeWidth={3} />
          COPY TEXT
        </Button>

        <Button
          onClick={handleDownload}
          className="bg-green-400 hover:bg-green-500 text-black font-black px-4 py-2 rounded-none shadow-[3px_3px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] transition-all duration-200 border-2 border-black"
        >
          <Download className="w-4 h-4 mr-2" strokeWidth={3} />
          DOWNLOAD
        </Button>

        {typeof navigator !== "undefined" &&
          "share" in navigator &&
          typeof navigator.share === "function" && (
            <Button
              onClick={handleShare}
              className="bg-pink-400 hover:bg-pink-500 text-black font-black px-4 py-2 rounded-none shadow-[3px_3px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] transition-all duration-200 border-2 border-black"
            >
              <Share2 className="w-4 h-4 mr-2" strokeWidth={3} />
              SHARE
            </Button>
          )}
      </div>
    </div>
  );
}
