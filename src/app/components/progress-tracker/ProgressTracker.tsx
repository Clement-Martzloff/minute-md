"use client";

import ProgressHeader from "@/src/app/components/progress-tracker/ProgressHeader";
import ProgressStepsList from "@/src/app/components/progress-tracker/ProgressStepsList";
import type { ProgressEvent } from "@/src/app/components/progress-tracker/types";
import { usePipelineState } from "@/src/lib/hooks/usePipelineState";

export interface ProgressTrackerProps {
  events: ProgressEvent[];
}

export default function ProgressTracker({ events }: ProgressTrackerProps) {
  const { pipelineState, elapsedTime } = usePipelineState(events);

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
