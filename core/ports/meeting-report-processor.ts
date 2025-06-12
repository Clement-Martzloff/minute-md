/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document } from "@/core/domain/document";

export type MeetingReportProcessingResult =
  | { status: "success"; summary: string; state: any } // state is useful for continuing a workflow later
  | { status: "irrelevant"; reason: string; state: any }
  | { status: "error"; reason: string; state: any };

export interface MeetingReportProcessor {
  process(documents: Document[]): Promise<MeetingReportProcessingResult>;
}
