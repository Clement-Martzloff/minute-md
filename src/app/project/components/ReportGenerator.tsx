"use client";

import { useSourcesStore } from "@/src/app/project/store/useSourcesStore";
import { Root } from "mdast";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkStringify from "remark-stringify";
import { unified } from "unified";

type ServerStreamEvent =
  | { type: "pipeline-start" }
  | { type: "step-start"; stepName: string }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: "step-chunk"; stepName: string; chunk: Record<string, any> } // Corrected event type
  | { type: "step-end"; stepName: string }
  | {
      type: "pipeline-end";
      status: "success" | "error" | "irrelevant";
      message: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      finalReport: Record<string, any> | null;
    }
  | { type: "error"; message: string };

interface LoggedEvent {
  id: number;
  text: string;
}

export const ReportGenerator = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [events, setEvents] = useState<LoggedEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [finalMarkdown, setFinalMarkdown] = useState("");
  const allSources = useSourcesStore((state) => state.sources);
  const selectedSources = useMemo(
    () => allSources.filter((source) => source.selected),
    [allSources]
  );

  const startGeneration = async () => {
    setIsProcessing(true);
    setEvents([]);
    setError(null);
    setFinalMarkdown("");

    try {
      const response = await fetch("/api/meeting-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sources: selectedSources }),
      });

      if (!response.ok || !response.body) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to start generation.");
      }

      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();

      const mdastProcessor = unified().use(remarkStringify);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const lines = value
          .split("\n\n")
          .filter((line) => line.trim().startsWith("data: "));

        for (const line of lines) {
          const jsonString = line.substring(line.indexOf("{"));
          if (!jsonString) continue;

          let event: ServerStreamEvent;
          try {
            event = JSON.parse(jsonString) as ServerStreamEvent;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e) {
            console.error("Failed to parse SSE event JSON:", jsonString);
            continue;
          }

          let logText = "";
          const shouldLog = true;

          switch (event.type) {
            case "pipeline-start":
              logText = "Pipeline started...";
              break;
            case "step-start":
              logText = `[START] ${event.stepName}`;
              break;
            case "step-chunk":
              // Instead of trying to build a broken string, log the chunk content itself.
              // This is useful for debugging and shows the actual data being received.
              // We use JSON.stringify to display the object in a readable format.
              logText = `[CHUNK] from '${event.stepName}':\n${JSON.stringify(
                event.chunk,
                null,
                2
              )}`;
              break;
            case "step-end":
              logText = `[END] ${event.stepName}`;
              break;
            // FIX: This logic remains corrected from the previous analysis.
            case "pipeline-end":
              if (event.status === "error" || event.status === "irrelevant") {
                logText = `Pipeline finished with status '${event.status}': ${event.message}`;
                setError(event.message);
              } else if (event.status === "success" && event.finalReport) {
                logText = "Pipeline finished successfully.";
                const markdownOutput = mdastProcessor.stringify(
                  event.finalReport as Root
                );
                setFinalMarkdown(markdownOutput);
              } else {
                logText = `Pipeline finished with status '${event.status}' but no report was generated.`;
              }
              break;
            case "error":
              logText = `[ERROR] ${event.message}`;
              setError(event.message);
              break;
          }

          if (shouldLog) {
            setEvents((prev) => [...prev, { id: prev.length, text: logText }]);
          }
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={startGeneration}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        disabled={isProcessing || selectedSources.length === 0}
      >
        {isProcessing ? "Generating..." : "Generate Report"}
      </button>

      {/* FIX: Removed the incorrect "Streaming Raw MDAST" section */}

      {/* Section for Final Rendered Report */}
      {finalMarkdown && (
        <div>
          <h3 className="text-lg font-semibold">Generated Report</h3>
          <div className="mt-2 p-4 border rounded-md prose prose-sm max-w-none">
            <ReactMarkdown>{finalMarkdown}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Section for Generation Log */}
      <div>
        <h3 className="text-lg font-semibold">Generation Log</h3>
        {/* Using <pre> with whitespace-pre-wrap to nicely format the stringified JSON */}
        <div className="mt-2 p-4 border rounded-md bg-gray-50 font-mono text-sm max-h-96 overflow-y-auto">
          {events.length === 0 && !isProcessing && (
            <p className="text-gray-400">Log will appear here...</p>
          )}
          {events.map((event) => (
            <pre key={event.id} className="mb-1 whitespace-pre-wrap">
              {event.text}
            </pre>
          ))}
          {error && (
            <p className="mt-2 text-red-600 font-bold">[Error]: {error}</p>
          )}
        </div>
      </div>
    </div>
  );
};
