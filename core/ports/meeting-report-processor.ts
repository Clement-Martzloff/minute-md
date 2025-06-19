import { Document } from "@/core/domain/document";
import { MeetingReport } from "@/core/domain/meeting";

export interface MeetingReportState {
  failureReason?: string;
  meetingReportDraft?: MeetingReport;
}

export type MeetingReportGenerationStep =
  | "relevance-filter"
  | "documents-synthesis"
  | "report-extraction";

export type MeetingProcessorStreamChunk =
  | { type: "pipeline-start" }
  | { type: "step-start"; stepName: MeetingReportGenerationStep }
  | { type: "step-end"; stepName: MeetingReportGenerationStep }
  | { type: "pipeline-end"; state: MeetingReportState };

export interface MeetingReportProcessor {
  stream(documents: Document[]): AsyncIterable<MeetingProcessorStreamChunk>;
}
