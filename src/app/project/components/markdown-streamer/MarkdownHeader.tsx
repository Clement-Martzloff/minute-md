import StreamingIndicator from "@/src/app/project/components/markdown-streamer/StreamingIndicator";
import { FileText, Zap } from "lucide-react";

interface MarkdownHeaderProps {
  title?: string;
  isStreaming?: boolean;
  wordCount?: number;
}

export default function MarkdownHeader({
  title = "AI REPORT OUTPUT",
  isStreaming = false,
  wordCount = 0,
}: MarkdownHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-purple-300 border-b-4 border-black">
      <div className="flex items-center gap-3">
        <div className="bg-white p-2 rounded-none border-2 border-black shadow-[2px_2px_0px_0px_#000]">
          <FileText className="h-5 w-5 text-black" strokeWidth={3} />
        </div>
        <div>
          <h3 className="font-black text-xl text-black tracking-tight">
            {title}
          </h3>
          <p className="font-bold text-black text-sm opacity-80">
            {wordCount > 0 && `${wordCount.toLocaleString()} words • `}
            {isStreaming ? "Generating..." : "Complete"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isStreaming && <StreamingIndicator />}
        <div className="bg-yellow-300 border-2 border-black rounded-none px-3 py-1 shadow-[2px_2px_0px_0px_#000]">
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-black" strokeWidth={3} />
            <span className="font-black text-black text-xs">AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
