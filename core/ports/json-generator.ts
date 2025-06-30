import { Document } from "@/core/entities/document";
import { MeetingReportDto } from "@/core/entities/meeting-report";
import { StepEnd, StepStart } from "@/core/events/generation-events";

export * from "@/core/events/generation-events";

export type JsonGenerationStep =
  | "documents-relevance-filter"
  | "documents-synthesis"
  | "json-report-extraction";

export type JsonGenerationEvent =
  | StepStart<JsonGenerationStep>
  | StepEnd<
      JsonGenerationStep,
      { jsonReport: MeetingReportDto | null; failureReason?: string }
    >;

export interface JsonGenerator {
  generate(meetingReport: Document[]): AsyncIterable<JsonGenerationEvent>;
}
