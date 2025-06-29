"use client";

// import { EventLogger } from "@/src/app/project/components/EventLogger";
import { ProgressTracker } from "@/src/app/project/components/ProgressTracker";
import { RawMarkdownStreamDisplay } from "@/src/app/project/components/RawMarkdownStreamDisplay";
import { useMemo, useState } from "react";

// Import all the specific event and type definitions from your core layer
// --- Adjust these import paths to match your project structure ---
import { JsonGenerationEvent } from "@/core/ports/meeting-report-json-generator";
import { MarkdownGenerationEvent } from "@/core/ports/meeting-report-markdown-generator";
import { Button } from "@/src/components/ui/button";
import GooglePickerButton from "./components/GooglePickerButton";
import SelectedSourcesList from "./components/SelectedSourcesList";
import { useSourcesStore } from "./store/useSourcesStore";
// ---

// Create a union of all possible events for type-safe handling
type ProcessingEvent = JsonGenerationEvent | MarkdownGenerationEvent;

export default function GenerateReportPage() {
  const [events, setEvents] = useState<ProcessingEvent[]>([]);
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const allSources = useSourcesStore((state) => state.sources);
  const selectedSources = useMemo(
    () => allSources.filter((source) => source.selected),
    [allSources]
  );

  const handleGenerateReport = async () => {
    // 1. Reset state for a new request
    setIsLoading(true);
    setError(null);
    setEvents([]);
    setMarkdownContent("");

    try {
      // 2. Make the POST request
      const response = await fetch("/api/meeting-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sources: selectedSources }),
      });

      // 3. Handle non-streaming errors (e.g., 4xx, 5xx)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An server error occurred.");
      }

      if (!response.body) {
        throw new Error("Response body is missing.");
      }

      // 4. Process the SSE stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const eventStrings = buffer.split("\n\n");
        buffer = eventStrings.pop() || "";

        for (const eventString of eventStrings) {
          if (eventString.startsWith("data: ")) {
            const jsonString = eventString.substring(6);
            try {
              const event: ProcessingEvent = JSON.parse(jsonString);

              // --- CORE LOGIC ---
              // Add every event to the main log for the EventLogger
              setEvents((prevEvents) => [...prevEvents, event]);

              // Handle specific event types for UI updates
              switch (event.type) {
                case "step-chunk":
                  // This is the markdown content we want to display
                  if (event.stepName === "markdown-generation") {
                    // Because the chunk type is correctly typed as string, this is safe
                    setMarkdownContent((prev) => prev + event.chunk);
                  }
                  break;

                // The ProgressTracker will automatically react to these events
                // because it's receiving the full `events` list.
                // No specific state updates are needed here for them.
                case "pipeline-start":
                case "step-start":
                case "step-end":
                case "pipeline-end":
                  // You could add specific logic here if needed, e.g.:
                  if (
                    event.type === "pipeline-end" &&
                    event.status === "failure"
                  ) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    console.error("Pipeline failed:", (event as any).message);
                  }
                  break;
              }
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
              console.error("Failed to parse SSE event JSON:", jsonString);
            }
          }
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Failed to generate report:", message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold mb-6">Meeting Report Generator</h1>

      <div className="flex flex-col space-x-4">
        <GooglePickerButton />
        <SelectedSourcesList />
        <Button
          onClick={handleGenerateReport}
          disabled={isLoading}
          variant="destructive"
          className="min-w-[120px] mx-auto"
        >
          {isLoading ? "Generating..." : "Generate Report"}
        </Button>

        {error && (
          <div className="p-4 bg-red-100 text-red-800 rounded-md">
            <strong>Error:</strong> {error}
          </div>
        )}

        {isLoading && <ProgressTracker events={events} />}

        {markdownContent && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Generated Report</h2>
            <RawMarkdownStreamDisplay content={markdownContent} />
          </div>
        )}

        {/* The event logger is useful for development */}
        {/* {events.length > 0 && <EventLogger events={events} />} */}
      </div>
    </main>
  );
}
