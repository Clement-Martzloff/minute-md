import { JsonGenerationEvent } from "@/core/ports/meeting-report-json-generator";
import { MarkdownGenerationEvent } from "@/core/ports/meeting-report-markdown-generator";
import React from "react";

// Define a minimal event type for this component's props
// This prevents the component from needing to know about all possible event types
type ProgressEvent = JsonGenerationEvent | MarkdownGenerationEvent;

interface ProgressTrackerProps {
  events: ProgressEvent[];
}

const stepFriendlyNames: Record<string, string> = {
  "documents-relevance-filter": "Filtering Relevant Documents",
  "documents-synthesis": "Synthesizing Information",
  "json-report-extraction": "Extracting Key Data",
  "markdown-generation": "Formatting the Report",
};

/**
 * Displays the live progress of the report generation pipeline.
 */
export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ events }) => {
  if (events.length === 0) {
    return null;
  }

  const stepEvents = events.filter(
    (e) => e.type === "step-start" || e.type === "step-end"
  ) as Extract<ProgressEvent, { type: "step-start" | "step-end" }>[];

  const lastEvent = events[events.length - 1];

  let currentStatus = "Initializing...";
  if (lastEvent.type === "step-start") {
    currentStatus =
      stepFriendlyNames[lastEvent.stepName] || "Starting new step...";
  } else if (lastEvent.type === "pipeline-end") {
    currentStatus =
      lastEvent.status === "success"
        ? "Generation Complete!"
        : "Generation Failed.";
  }

  return (
    <div className="p-4 my-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
      <h3 className="font-semibold text-lg mb-2">Progress</h3>
      <p className="text-blue-600 dark:text-blue-400 font-medium">
        {currentStatus}
      </p>
      <ul className="mt-2 list-disc list-inside">
        {stepEvents.map(
          (event, index) =>
            event.type === "step-start" && (
              <li
                key={index}
                className="text-sm text-gray-600 dark:text-gray-300"
              >
                {stepFriendlyNames[event.stepName] || event.stepName}...
              </li>
            )
        )}
      </ul>
    </div>
  );
};
