import { Document } from "@/core/entities/document";
import { MeetingReport } from "@/core/entities/meeting-report";
import {
  JsonGenerationEvent,
  MeetingReportJsonGenerator,
} from "@/core/ports/meeting-report-json-generator";
import {
  MarkdownGenerationEvent,
  MeetingReportMarkdownGenerator,
} from "@/core/ports/meeting-report-markdown-generator";
import { v4 as uuidv4 } from "uuid";

export class GenerateMeetingReportUseCase {
  constructor(
    private jsonGenerator: MeetingReportJsonGenerator,
    private markdownGenerator: MeetingReportMarkdownGenerator
  ) {}

  public async *execute(
    documents: Document[]
  ): AsyncGenerator<JsonGenerationEvent | MarkdownGenerationEvent> {
    try {
      let jsonReport = null;
      const jsonGenerationEvents = this.jsonGenerator.generate(documents);

      for await (const jsonGenerationEvent of jsonGenerationEvents) {
        yield jsonGenerationEvent;

        if (
          jsonGenerationEvent.type === "pipeline-end" &&
          jsonGenerationEvent.result
        ) {
          jsonReport = jsonGenerationEvent.result;
        }
      }

      if (!jsonReport) {
        return undefined;
      }

      const meetingReport = new MeetingReport({ id: uuidv4(), ...jsonReport });

      const markdownGenerationEvents =
        this.markdownGenerator.generate(meetingReport);

      for await (const markdownGenerationEvent of markdownGenerationEvents) {
        yield markdownGenerationEvent;
      }
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);

      console.error(
        "An error occurred during the report generation stream:",
        reason
      );
    }
  }
}
