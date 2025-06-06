import { Document } from "@/core/domain/document";
import { MeetingReport } from "@/core/domain/meeting";
import { MeetingReportGenerator } from "@/core/ports/meeting-report-generator";

export class TooManyDocumentsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TooManyDocumentsError";
  }
}

export class DocumentsTooLargeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DocumentsTooLargeError";
  }
}

export class GenerateMeetingReportUseCase {
  private readonly MAX_DOCUMENTS = 10;
  private readonly MAX_TOTAL_CONTENT_SIZE_BYTES = 5 * 1024 * 1024;

  constructor(private generator: MeetingReportGenerator) {}

  async execute(documents: Document[]): Promise<MeetingReport> {
    if (documents.length > this.MAX_DOCUMENTS) {
      throw new TooManyDocumentsError(
        `Cannot generate report from more than ${this.MAX_DOCUMENTS} documents. Received ${documents.length}.`
      );
    }

    const totalContentSize = documents.reduce(
      (sum, doc) => sum + new TextEncoder().encode(doc.content).length,
      0
    );
    if (totalContentSize > this.MAX_TOTAL_CONTENT_SIZE_BYTES) {
      throw new DocumentsTooLargeError(
        `Total document content size exceeds ${
          this.MAX_TOTAL_CONTENT_SIZE_BYTES / (1024 * 1024)
        } MB. Current size: ${totalContentSize / (1024 * 1024)} MB.`
      );
    }

    const report = await this.generator.generate(documents);
    await this.wait(1000); // Wait for 1 second
    return report;
  }

  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
