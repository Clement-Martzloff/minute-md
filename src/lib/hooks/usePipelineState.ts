"use client";

import { PipelineEnd, PipelineStart } from "@/core/events/generation-events";
import type {
  AllStepNames,
  PipelineState,
  ProgressEvent,
} from "@/src/app/components/progress-tracker/types";
import { useEffect, useMemo, useRef, useState } from "react";

declare module "@/src/app/components/progress-tracker/types" {
  interface PipelineState {
    isApiRequestPending: boolean;
  }
}

const stepFriendlyNames: Record<AllStepNames, string> = {
  "documents-relevance-filter": "Filtering relevant documents",
  "documents-synthesis": "Synthesizing informations",
  "json-report-extraction": "Extracting key data",
  "markdown-generation": "Generating the report",
};

export function usePipelineState(events: ProgressEvent[]) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isApiRequestPending, setIsApiRequestPending] = useState(false);

  const pipelineState = useMemo((): PipelineState => {
    if (events.length === 0) {
      startTimeRef.current = null;
      return {
        isRunning: false,
        mainStatus: "Waiting...",
        steps: [],
        isFinished: false,
        isApiRequestPending: false,
      };
    }

    const startEvent = events.find(
      (e): e is PipelineStart => e.type === "pipeline-start",
    );
    const endEvent = events.find(
      (e): e is PipelineEnd => e.type === "pipeline-end",
    );

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

    const steps = Array.from(startedSteps).map((stepName) => {
      const status: "completed" | "running" = completedSteps.has(stepName)
        ? "completed"
        : "running";

      return {
        name: stepFriendlyNames[stepName] || stepName,
        status,
      };
    });

    let mainStatus = "Thinking";
    if (endEvent) {
      mainStatus = endEvent.status === "success" ? "Complete" : "Failed";
      steps.forEach((step) => (step.status = "completed")); // End of pipeline = all completed
    }

    return {
      isRunning: !!startEvent && !endEvent,
      mainStatus,
      steps,
      isFinished: !!endEvent,
      isApiRequestPending,
    };
  }, [events, isApiRequestPending]);

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

  return { pipelineState, elapsedTime, setIsApiRequestPending };
}
