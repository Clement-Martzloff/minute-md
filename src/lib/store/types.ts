import type {
  PipelineEnd,
  PipelineStart,
} from "@/core/events/generation-events";
import type {
  JsonGenerationEvent,
  JsonGenerationStep,
} from "@/core/ports/json-generator";
import type {
  MarkdownGenerationEvent,
  MarkdownGenerationStep,
} from "@/core/ports/markdown-generator";

export type ProgressEvent =
  | JsonGenerationEvent
  | MarkdownGenerationEvent
  | PipelineStart
  | PipelineEnd;

export type Status = "pending" | "running" | "finished";

export type AllStepNames = JsonGenerationStep | MarkdownGenerationStep;
