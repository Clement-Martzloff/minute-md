import { Document } from "@/core/entities/document";
import { MeetingReportData } from "@/core/entities/meeting-report";
import {
  PipelineEnd,
  PipelineEndStatus,
  PipelineStart,
  StepEnd,
  StepStart,
} from "@/core/events/generation-events";

export * from "@/core/events/generation-events";

export type JsonGenerationPipelineEndStatus = PipelineEndStatus | "irrelevant";

export class JsonGenerationPipelineEnd<TResult> extends PipelineEnd<
  TResult,
  JsonGenerationPipelineEndStatus
> {
  constructor(
    result: TResult | null = null,
    status: JsonGenerationPipelineEndStatus,
    public readonly message?: string
  ) {
    super(result, status);
  }
}

export type JsonGenerationStep =
  | "documents-relevance-filter"
  | "documents-synthesis"
  | "json-report-extraction";

export type JsonGenerationEvent =
  | PipelineStart
  | JsonGenerationPipelineEnd<MeetingReportData>
  | StepStart<JsonGenerationStep>
  | StepEnd<JsonGenerationStep>;

export interface MeetingReportJsonGenerator {
  generate(meetingReport: Document[]): AsyncIterable<JsonGenerationEvent>;
}
