"use client";

import ProgressTracker from "@/src/app/components/progress-tracker/ProgressTracker";
import type { ProgressEvent } from "@/src/app/components/progress-tracker/types";
import { useEffect, useState } from "react";

export default function DummyProgressPage() {
  const [events, setEvents] = useState<ProgressEvent[]>([]);

  useEffect(() => {
    const dummyEvents: ProgressEvent[] = [
      { type: "pipeline-start" },
      { type: "step-start", stepName: "documents-relevance-filter" },
      {
        type: "step-end",
        stepName: "documents-relevance-filter",
        state: { jsonReport: null },
      },
      { type: "step-start", stepName: "documents-synthesis" },
      {
        type: "step-end",
        stepName: "documents-synthesis",
        state: { jsonReport: null },
      },
      { type: "step-start", stepName: "json-report-extraction" },
      {
        type: "step-end",
        stepName: "json-report-extraction",
        state: { jsonReport: null },
      },
      { type: "step-start", stepName: "markdown-generation" },
      {
        type: "step-end",
        stepName: "markdown-generation",
        state: { markdownString: "Dummy Markdown" },
      },
      { type: "pipeline-end", status: "success", result: {} },
    ];

    // Simulate events arriving over time
    let eventIndex = 0;
    const interval = setInterval(() => {
      if (eventIndex < dummyEvents.length) {
        setEvents((prevEvents) => [...prevEvents, dummyEvents[eventIndex]]);
        eventIndex++;
      } else {
        clearInterval(interval);
      }
    }, 4000); // Add an event every second. Note: Timestamps are handled internally by ProgressTracker.

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen space-y-6 bg-gradient-to-br from-orange-100 via-pink-100 to-red-100">
      <ProgressTracker events={events} />
    </div>
  );
}
