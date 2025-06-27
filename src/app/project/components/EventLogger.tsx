import { JsonGenerationEvent } from "@/core/ports/meeting-report-json-generator"; // Adjust path as needed
import { MarkdownGenerationEvent } from "@/core/ports/meeting-report-markdown-generator";
import React from "react";

// A union type for all possible events from the use case
type ProcessingEvent = JsonGenerationEvent | MarkdownGenerationEvent;

interface EventLoggerProps {
  events: ProcessingEvent[];
}

/**
 * A component to log and display events received from the backend stream.
 */
export const EventLogger: React.FC<EventLoggerProps> = ({ events }) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold">Event Log</h3>
      <pre className="mt-2 h-64 overflow-y-auto rounded-md bg-gray-100 p-4 text-xs dark:bg-gray-800">
        {events.map((event, index) => (
          <code key={index} className="block whitespace-pre-wrap">
            {JSON.stringify(event, null, 2)}
            {"\n\n"}
          </code>
        ))}
      </pre>
    </div>
  );
};
