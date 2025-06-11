import { Document } from "@/core/domain/document";
import { MeetingReport } from "@/core/domain/meeting";

export interface MeetingReportGenerator {
  generate(documents: Document[]): Promise<MeetingReport>;
}
