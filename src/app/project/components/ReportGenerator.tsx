"use client";

import { useMemo, useState } from "react";
import { useSourcesStore } from "../store/useSourcesStore";

// 1. Define the shape of the events on the client-side.
// This gives you full type safety and autocompletion!
type ClientProcessingEvent = {
  type: "pipeline-start" | "step-start" | "step-end" | "pipeline-end" | "error";
  message: string;
  stepName?: string; // Only present on step events
  status?: "success" | "error" | "irrelevant"; // Only on pipeline:end
  // You could add finalReport here if you wanted to display it
};

interface LoggedEvent {
  id: number;
  name: string;
  message: string;
  status?: "success" | "error" | "irrelevant";
}

export const ReportGenerator = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [events, setEvents] = useState<LoggedEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  const allSources = useSourcesStore((state) => state.sources);
  const selectedSources = useMemo(
    () => allSources.filter((source) => source.selected),
    [allSources]
  );

  const startGeneration = async () => {
    setIsProcessing(true);
    setEvents([]);
    setError(null);

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

      while (true) {
        const { value, done } = await reader.read();

        // The stream is naturally finished, break the loop.
        if (done) {
          break;
        }

        const lines = value
          .split("\n\n")
          .filter((line) => line.trim().startsWith("data: "));

        for (const line of lines) {
          const json = line.substring(line.indexOf("{"));
          if (!json) continue;

          const event = JSON.parse(json) as ClientProcessingEvent;

          // 2. Use a switch on the event type for robust logic
          let name = "System";
          const message = event.message;

          switch (event.type) {
            case "pipeline-start":
              name = "Process Start";
              break;
            case "step-start":
              name = `Starting: ${event.stepName}`;
              break;
            case "step-end":
              name = `Finished: ${event.stepName}`;
              break;
            case "pipeline-end":
              name = "Process Complete";
              // We don't need to manually stop the stream, 'done' will be true on the next read.
              break;
            case "error":
              name = "Error";
              setError(message); // Set the dedicated error state
              // We could cancel the reader here if we want to stop immediately on error
              // reader.cancel();
              break;
          }

          setEvents((prev) => [
            ...prev,
            { id: prev.length, name, message, status: event.status },
          ]);
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
    <div>
      <button
        onClick={startGeneration}
        className="px-4 mb-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        disabled={isProcessing || selectedSources.length === 0}
      >
        {isProcessing ? "Generating..." : "Generate Report"}
      </button>

      <div className="mt-4 p-4 border rounded-md bg-gray-50 font-mono text-sm max-h-96 overflow-y-auto">
        {events.length === 0 && !isProcessing && (
          <p className="text-gray-400">Generation log will appear here...</p>
        )}
        {events.map((event) => (
          <p key={event.id} className="mb-1">
            <strong className="font-bold mr-2">{`[${event.name}]`}</strong>
            <span
              className={event.status === "irrelevant" ? "text-yellow-600" : ""}
            >
              {event.message}
            </span>
          </p>
        ))}
        {error && (
          <p className="mt-2 text-red-600 font-bold">[Error]: {error}</p>
        )}
      </div>
    </div>
  );
};
