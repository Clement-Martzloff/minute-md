import { MeetingReport } from "@/core/entities/meeting-report";
import { StepChunk, StepEnd, StepStart } from "@/core/events/generation-events";

export * from "@/core/events/generation-events";

export type MarkdownGenerationStep = "markdown-generation";

export type MarkdownGenerationEvent =
  | StepStart<MarkdownGenerationStep>
  | StepEnd<MarkdownGenerationStep, { markdownString: string }>
  | StepChunk<MarkdownGenerationStep>;

export interface MeetingReportMarkdownGenerator {
  generate(
    meetingReport: MeetingReport
  ): AsyncIterable<MarkdownGenerationEvent>;
}
