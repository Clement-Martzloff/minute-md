import {
  markdownStreamerClasses,
  scrollbarClasses,
} from "@/src/app/components/markdown-streamer/constants";
import { cn } from "@/src/lib/utils";

interface StreamingTextAreaProps {
  markdownContent: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  handleScroll: (event: React.UIEvent<HTMLDivElement>) => void;
}

export default function StreamingTextArea({
  markdownContent,
  containerRef,
  handleScroll,
}: StreamingTextAreaProps) {
  return (
    <div
      ref={containerRef}
      className={cn(markdownStreamerClasses, scrollbarClasses)}
      onScroll={handleScroll}
    >
      <pre className="font-mono text-sm break-words whitespace-pre-wrap">
        <code>{markdownContent}</code>
      </pre>
    </div>
  );
}
