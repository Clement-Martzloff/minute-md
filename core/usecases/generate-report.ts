import { Document } from "@/core/entities/document";
import { MeetingReport } from "@/core/entities/meeting-report";
import {
  PipelineEnd,
  PipelineStart,
  StepEnd,
} from "@/core/events/generation-events";
import {
  JsonGenerationEvent,
  JsonGenerator,
} from "@/core/ports/json-generator";
import {
  MarkdownGenerationEvent,
  MarkdownGenerator,
} from "@/core/ports/markdown-generator";
import { v4 as uuidv4 } from "uuid";

export class GenerateReportUseCase {
  constructor(
    private jsonGenerator: JsonGenerator,
    private markdownGenerator: MarkdownGenerator
  ) {}

  public async *execute(
    documents: Document[]
  ): AsyncGenerator<
    PipelineStart | JsonGenerationEvent | MarkdownGenerationEvent | PipelineEnd
  > {
    yield new PipelineStart();

    try {
      let jsonReport = null;
      const jsonEvents = this.jsonGenerator.generate(documents);

      for await (const jsonEvent of jsonEvents) {
        yield jsonEvent;

        if (jsonEvent instanceof StepEnd && jsonEvent.state.failureReason) {
          yield new PipelineEnd(null, "failure", jsonEvent.state.failureReason);

          return;
        }
        if (jsonEvent instanceof StepEnd && jsonEvent.state.jsonReport) {
          jsonReport = jsonEvent.state.jsonReport;
        }
      }

      if (!jsonReport) {
        yield new PipelineEnd(null, "failure", "Report generation failed.");

        return;
      }

      const meetingReport = new MeetingReport({ id: uuidv4(), ...jsonReport });
      const markdownEvents = this.markdownGenerator.generate(meetingReport);

      for await (const markdownEvent of markdownEvents) {
        yield markdownEvent;

        if (markdownEvent instanceof StepEnd && markdownEvent.state) {
          yield new PipelineEnd(markdownEvent.state, "success");
        }
      }
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);

      console.error(
        "An error occurred during the report generation stream:",
        reason
      );

      throw new Error(reason);
    }
  }
}
