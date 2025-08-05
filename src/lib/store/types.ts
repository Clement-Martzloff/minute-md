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
import type { FileItem } from "@/src/app/components/files-dropzone/types";
import { PipelineState } from "@/src/lib/store/interfaces";

export type ProgressEvent =
  | JsonGenerationEvent
  | MarkdownGenerationEvent
  | PipelineStart
  | PipelineEnd;

// This is the new type for the stable parts of the state
export type PipelineStableState = Omit<PipelineState, "elapsedTime">;

export type Status = "pending" | "running" | "finished";

export type PipelineAction =
  | { type: "START" }
  | { type: "STEP_STARTED"; stepName: AllStepNames }
  | { type: "STEP_FINISHED" }
  | { type: "END_SUCCESS" }
  | { type: "END_FAILURE"; reason: string }
  | { type: "SET_SOURCES"; sources: FileItem[] }
  | { type: "REMOVE_SOURCE"; id: string }
  | { type: "CLEAR_SOURCES" }
  | { type: "SET_ELAPSED"; time: number };

export type AllStepNames = JsonGenerationStep | MarkdownGenerationStep;
