import { Document } from "@/core/domain/document";
import { MeetingReport } from "@/core/domain/meeting";
import { MeetingReportGenerator } from "@/core/ports/meeting-report-generator";

export class GenerateMeetingReportUseCase {
  constructor(private readonly generator: MeetingReportGenerator) {}

  public async execute(documents: Document[]): Promise<MeetingReport> {
    console.log("Generating report from pre-validated documents...");
    const report = await this.generator.generate(documents);
    return report;
  }
}
