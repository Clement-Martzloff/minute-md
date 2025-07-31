"use client";

import CopyButton from "@/src/app/components/markdown-streamer/CopyButton.tsx";
import StreamingTextArea from "@/src/app/components/markdown-streamer/StreamingTextArea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { useReportState } from "@/src/lib/hooks/useReportState";
import { useState } from "react";
import StyledMarkdownDisplay from "./StyledMarkdownDisplay";

export default function MarkdownStreamer() {
  const { markdownContent, pipelineState } = useReportState();
  const [copyButtonLabel, setCopyButtonLabel] = useState("Copy");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setActiveTab] = useState("raw");

  const isFinished = pipelineState.status === "finished";

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
    <div className="flex-col">
      <Tabs defaultValue="raw" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger className="cursor-pointer" value="raw">
              Raw
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer"
              value="styled"
              disabled={!isFinished}
            >
              Preview
            </TabsTrigger>
          </TabsList>
          <CopyButton onCopy={handleCopy} copyButtonLabel={copyButtonLabel} />
        </div>

        <TabsContent value="raw">
          <StreamingTextArea content={markdownContent} />
        </TabsContent>
        <TabsContent value="styled">
          <StyledMarkdownDisplay content={markdownContent} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
