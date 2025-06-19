"use client";

import { useMemo, useState } from "react";
import { useSourcesStore } from "../store/useSourcesStore";

// A simple interface for logging events to the UI
interface LoggedEvent {
  name: string;
  message: string;
}

export const ReportGenerator = () => {
  // State for tracking if the process is running, the log of events, and any errors.
  const [isProcessing, setIsProcessing] = useState(false);
  const [events, setEvents] = useState<LoggedEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  // 1. Select the RAW sources array.
  // This will only cause a re-render if the `sources` array reference itself changes.
  const allSources = useSourcesStore((state) => state.sources);

  // 2. Derive the selected sources using useMemo.
  // This filter only re-runs if `allSources` changes. The result is cached.
  const selectedSources = useMemo(
    () => allSources.filter((source) => source.selected),
    [allSources]
  );

  const startGeneration = async () => {
    // 1. Reset state for a new run
    setIsProcessing(true);
    setEvents([]);
    setError(null);

    try {
      const response = await fetch("/api/meeting-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // We send an empty array since the store dependency was removed
        body: JSON.stringify({ sources: selectedSources }),
      });

      if (!response.ok || !response.body) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to start generation.");
      }

      // 2. Process the stream of Server-Sent Events (SSE)
      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // An SSE stream can send multiple events in one chunk
        const lines = value
          .split("\n\n")
          .filter((line) => line.startsWith("data: "));

        for (const line of lines) {
          const json = line.substring(6);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const event: any = JSON.parse(json);

          // 3. Determine the event name and message for logging
          let eventName = "System Message";
          let shouldStop = false;

          if (event.message?.startsWith("An error occurred")) {
            eventName = "Error";
            setError(event.message);
            shouldStop = true;
          } else if (event.message?.startsWith("Pipeline finished")) {
            eventName = "Pipeline End";
            shouldStop = true; // The process is finished
          } else if (event.stepName) {
            eventName = event.stepName; // This is a StepEndEvent
          }

          // Add the new event to our log for display
          setEvents((prev) => [
            ...prev,
            { name: eventName, message: event.message },
          ]);

          if (shouldStop) {
            reader.cancel(); // Gracefully stop reading from the stream
            break; // Exit the loop processing this chunk
          }
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected client-side error occurred.";
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
        disabled={isProcessing}
      >
        {isProcessing ? "Generating..." : "Generate"}
      </button>

      {/* Display a simple log of events as they arrive */}
      <div style={{ marginTop: "20px", fontFamily: "monospace" }}>
        {events.map((event, index) => (
          <p key={index}>
            <strong>{`[${event.name}]`}:</strong> {event.message}
          </p>
        ))}
      </div>

      {/* Display any final error message */}
      {error && (
        <div style={{ marginTop: "20px", color: "red", fontWeight: "bold" }}>
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};
