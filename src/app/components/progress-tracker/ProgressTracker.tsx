"use client";

import { PipelineEnd, PipelineStart } from "@/core/events/generation-events";
import ProgressHeader from "@/src/app/components/progress-tracker/ProgressHeader";
import ProgressStepsList from "@/src/app/components/progress-tracker/ProgressStepsList";
import type {
  AllStepNames,
  PipelineState,
  ProgressEvent,
} from "@/src/app/components/progress-tracker/types";
import { useEffect, useMemo, useRef, useState } from "react";

export interface ProgressTrackerProps {
  events: ProgressEvent[];
}

const stepFriendlyNames: Record<AllStepNames, string> = {
  "documents-relevance-filter": "Filtering relevant documents",
  "documents-synthesis": "Synthesizing informations",
  "json-report-extraction": "Extracting key data",
  "markdown-generation": "Generating the report",
};

export default function ProgressTracker({ events }: ProgressTrackerProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const pipelineState = useMemo((): PipelineState => {
    if (events.length === 0) {
      startTimeRef.current = null;
      return {
        isRunning: false,
        mainStatus: "Waiting...",
        steps: [],
        isFinished: false,
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
    <div className="mx-4 max-w-2xl overflow-hidden rounded-none border-4 border-black bg-cyan-100 shadow-[8px_8px_0px_0px_#000] md:mx-auto md:w-full">
      <ProgressHeader
        elapsedTime={elapsedTime}
        mainStatus={pipelineState.mainStatus}
        isRunning={pipelineState.isRunning}
      />
      <ProgressStepsList steps={pipelineState.steps} />
    </div>
  );
}
