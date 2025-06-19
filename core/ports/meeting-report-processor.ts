import { Document } from "@/core/domain/document";
import { MeetingReport } from "@/core/domain/meeting";

interface MeetingReportGenerationState {
  failureReason?: string;
  draft?: MeetingReport;
}

export type MeetingReportGenerationStep =
  | "relevance-filter"
  | "documents-synthesis"
  | "report-extraction"
  | "end";

export interface MeetingProcessorStreamChunk {
  stepName: MeetingReportGenerationStep;
  state: MeetingReportGenerationState;
}

export interface MeetingReportProcessor {
  stream(documents: Document[]): AsyncIterable<MeetingProcessorStreamChunk>;
}
