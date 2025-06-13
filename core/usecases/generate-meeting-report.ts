import { Document } from "@/core/domain/document";
import {
  MeetingReportProcessingResult,
  MeetingReportProcessor,
} from "@/core/ports/meeting-report-processor";
import { UseCase } from "@/core/usecases/types";

export class GenerateMeetingReportUseCase
  implements UseCase<Document[], Promise<MeetingReportProcessingResult>>
{
  constructor(private readonly processor: MeetingReportProcessor) {}

  public async execute(
    documents: Document[]
  ): Promise<MeetingReportProcessingResult> {
    console.log("Executing meeting report generation logic...");

    if (!documents || documents.length === 0) {
      console.log("Business rule failed: No documents provided.");
      return {
        status: "irrelevant",
        reason: "No documents were provided to process.",
        state: null,
      };
    }

    const result = await this.processor.process(documents);

    console.log(`Processing finished with status: ${result.status}`);

    return result;
  }
}
