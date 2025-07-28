import type {
  PipelineEnd,
  PipelineStart,
} from "@/core/events/generation-events";
import type { JsonGenerationEvent } from "@/core/ports/json-generator";
import type { MarkdownGenerationEvent } from "@/core/ports/markdown-generator";

export type ProgressEvent =
  | JsonGenerationEvent
  | MarkdownGenerationEvent
  | PipelineStart
  | PipelineEnd;
export type EventsWithStepName = Extract<ProgressEvent, { stepName: string }>;
export type AllStepNames = EventsWithStepName["stepName"];

export interface ProgressStep {
  name: string;
  status: "completed" | "running";
}

export type MainStatus = "Waiting..." | "Thinking" | "Complete" | "Failed";

export interface PipelineState {
  isRunning: boolean;
  mainStatus: MainStatus;
  steps: ProgressStep[];
  isFinished: boolean;
}
