"use client";

import CopyButton from "@/src/app/components/markdown-streamer/copy-button";
import StreamingTextArea from "@/src/app/components/markdown-streamer/streaming-text-area";
import StyledMarkdownDisplay from "@/src/app/components/markdown-streamer/styled-markdown-display";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { useReportStore } from "@/src/lib/store/useReportStore";

export default function MarkdownStreamer() {
  const status = useReportStore((state) => state.status);
  const stepName = useReportStore((state) => state.stepName);

  console.log("status", status);
  console.log("stepName", stepName);

  const isPipelineFinished = status === "finished";
  const isMarkdownGeneration = stepName === "markdown-generation";

  if (!isMarkdownGeneration) return null;

  return (
    <div className="flex-col">
      <Tabs defaultValue="raw">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger className="cursor-pointer" value="raw">
              Brut
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer"
              value="styled"
              disabled={!isPipelineFinished}
            >
              Aperçu
            </TabsTrigger>
          </TabsList>
          {isPipelineFinished && <CopyButton />}
        </div>
        <TabsContent value="raw">
          <StreamingTextArea />
        </TabsContent>
        <TabsContent value="styled">
          <StyledMarkdownDisplay />
        </TabsContent>
      </Tabs>
    </div>
  );
}
