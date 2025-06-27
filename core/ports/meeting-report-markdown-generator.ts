import { MeetingReport } from "@/core/entities/meeting-report";
import { PipelineStart, StepChunk } from "@/core/events/generation-events";

export * from "@/core/events/generation-events";

export type MarkdownGenerationStep = "markdown-generation";

export type MarkdownGenerationEvent =
  | PipelineStart
  | StepChunk<MarkdownGenerationStep, string>;

export interface MeetingReportMarkdownGenerator {
  generate(
    meetingReport: MeetingReport
  ): AsyncIterable<MarkdownGenerationEvent>;
}
