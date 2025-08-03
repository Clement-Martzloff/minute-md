"use client";

import { scrollbarClasses } from "@/src/app/components/markdown-streamer/constants";
import CopyButton from "@/src/app/components/markdown-streamer/CopyButton.tsx";
import StreamingTextArea from "@/src/app/components/markdown-streamer/StreamingTextArea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { useReportState } from "@/src/lib/hooks/useReportState";
import { cn } from "@/src/lib/utils";
import { useEffect, useRef, useState } from "react";
import StyledMarkdownDisplay from "./StyledMarkdownDisplay";

export default function MarkdownStreamer() {
  const { markdownContent, pipelineState } = useReportState();
  const [copyButtonLabel, setCopyButtonLabel] = useState("Copier");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setActiveTab] = useState("raw");

  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when content updates, if auto-scroll is active
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [markdownContent]);

  const isFinished = pipelineState.status === "finished";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopyButtonLabel("Copié !");
      setTimeout(() => {
        setCopyButtonLabel("Copier");
      }, 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  if (!markdownContent) return null;

  const commonClasses = cn(
    "bg-primary-foreground h-96 overflow-y-auto rounded-md border p-4",
    scrollbarClasses,
  );

  return (
    <div className="flex-col">
      <Tabs defaultValue="raw" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger className="cursor-pointer" value="raw">
              Brut
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer"
              value="styled"
              disabled={!isFinished}
            >
              Aperçu
            </TabsTrigger>
          </TabsList>
          <CopyButton onCopy={handleCopy} copyButtonLabel={copyButtonLabel} />
        </div>

        <TabsContent value="raw">
          <StreamingTextArea
            content={markdownContent}
            containerRef={containerRef}
            className={commonClasses}
          />
        </TabsContent>
        <TabsContent value="styled">
          <StyledMarkdownDisplay
            content={markdownContent}
            className={commonClasses}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
