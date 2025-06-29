// src/components/ui/ProgressTracker.tsx

import { JsonGenerationEvent } from "@/core/ports/meeting-report-json-generator"; // Adjust path
import { MarkdownGenerationEvent } from "@/core/ports/meeting-report-markdown-generator"; // Adjust path
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

// --- Type Definitions ---
type ProgressEvent = JsonGenerationEvent | MarkdownGenerationEvent;

interface ProgressTrackerProps {
  events: ProgressEvent[];
}

// Type-safe derivation of all possible step names
type EventsWithStepName = Extract<ProgressEvent, { stepName: string }>;
type AllStepNames = EventsWithStepName["stepName"];

const stepFriendlyNames: Record<AllStepNames, string> = {
  "documents-relevance-filter": "Filtering Relevant Documents",
  "documents-synthesis": "Synthesizing Information",
  "json-report-extraction": "Extracting Key Data",
  "markdown-generation": "Formatting the Report",
};

// --- Helper Components ---
const TypingDots = () => (
  <div className="flex space-x-1 ml-2">
    <div
      className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"
      style={{ animationDelay: "0ms", animationDuration: "1s" }}
    />
    <div
      className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"
      style={{ animationDelay: "200ms", animationDuration: "1s" }}
    />
    <div
      className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"
      style={{ animationDelay: "400ms", animationDuration: "1s" }}
    />
  </div>
);

const formatTime = (ms: number): string => {
  const minutes = String(Math.floor(ms / 60000)).padStart(2, "0");
  const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  const centiseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
  return `${minutes}:${seconds}.${centiseconds}`;
};

// --- Main Component ---
export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ events }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const pipelineState = useMemo(() => {
    if (events.length === 0) {
      startTimeRef.current = null;
      return {
        isRunning: false,
        mainStatus: "Waiting...",
        steps: [],
        isFinished: false,
      };
    }

    const startEvent = events.find((e) => e.type === "pipeline-start");
    const endEvent = events.find((e) => e.type === "pipeline-end");

    if (startEvent && startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }

    const startedSteps = new Set<AllStepNames>();
    const completedSteps = new Set<AllStepNames>();

    for (const event of events) {
      if (
        (event.type === "step-start" || event.type === "step-end") &&
        "stepName" in event
      ) {
        const stepName = event.stepName as AllStepNames;
        if (event.type === "step-start") startedSteps.add(stepName);
        else if (event.type === "step-end") completedSteps.add(stepName);
      }
    }

    const steps = Array.from(startedSteps).map((stepName) => ({
      name: stepFriendlyNames[stepName] || stepName,
      status: completedSteps.has(stepName) ? "completed" : "running",
    }));

    let mainStatus = "Thinking";
    if (endEvent) {
      mainStatus = endEvent.status === "success" ? "Complete" : "Failed";
      steps.forEach((step) => (step.status = "completed"));
    }

    return {
      isRunning: !!startEvent && !endEvent,
      mainStatus,
      steps,
      isFinished: !!endEvent,
    };
  }, [events]);

  useEffect(() => {
    const updateTimer = () => {
      if (startTimeRef.current) {
        setElapsedTime(Date.now() - startTimeRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    };

    if (pipelineState.isRunning) {
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    } else {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      if (pipelineState.isFinished && startTimeRef.current) {
        setElapsedTime(Date.now() - startTimeRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [pipelineState.isRunning, pipelineState.isFinished]);

  if (events.length === 0) return null;

  return (
    <Card className="w-full max-w-md mx-auto gap-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <span className="font-medium">{pipelineState.mainStatus}</span>
          {pipelineState.isRunning && <TypingDots />}
        </div>
        <Badge variant="secondary" className="font-mono text-xs">
          {formatTime(elapsedTime)}
        </Badge>
      </CardHeader>

      {pipelineState.steps.length > 0 && (
        <CardContent className="border-t pt-4">
          <ul className="space-y-3">
            {pipelineState.steps.map((step) => (
              <li
                key={step.name}
                // CORRECTED: Use composable animation utilities
                className="flex items-center gap-3 text-sm text-gray-400 animate-in fade-in-0 slide-in-from-y-2 duration-500 ease-out"
                // The animation delay still works perfectly with this method
                style={{
                  animationFillMode: "backwards",
                  animationDelay: "150ms",
                }}
              >
                {step.status === "running" && !pipelineState.isFinished ? (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600 flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                )}
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {step.name}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );
};
