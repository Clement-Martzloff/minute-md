import { Document } from "@/core/domain/document";
import {
  ErrorEvent,
  PipelineEndEvent,
  ProcessingEvent,
  ProcessingRuleError,
  StepEndEvent,
} from "@/core/events/processing-events";
import {
  MeetingReportGenerationStep,
  MeetingReportProcessor,
} from "@/core/ports/meeting-report-processor";

export class GenerateMeetingReportUseCase {
  constructor(private readonly processor: MeetingReportProcessor) {}

  public async *execute(
    documents: Document[]
  ): AsyncGenerator<ProcessingEvent> {
    if (!documents || documents.length === 0) {
      throw new ProcessingRuleError("At least one document must be provided.");
    }

    try {
      const processorStream = this.processor.stream(documents);

      for await (const chunk of processorStream) {
        const { stepName, state } = chunk;

        if (stepName === "end") {
          const finalReport = state.draft || null;
          const status = finalReport
            ? "success"
            : state.failureReason?.includes("irrelevant")
            ? "irrelevant"
            : "error";
          yield new PipelineEndEvent(status, finalReport, state.failureReason);
          return; // The use case's job is done.
        }

        // For all other steps, translate them into a `StepEndEvent`.
        const userFriendlyMessage = this.getMessageForStep(stepName);
        yield new StepEndEvent(stepName, userFriendlyMessage);
      }
    } catch (error) {
      // If the error is not one of our specific domain errors, wrap it.
      if (error instanceof ProcessingRuleError) {
        throw error;
      }
      yield new ErrorEvent(
        "runtime",
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  private getMessageForStep(step: MeetingReportGenerationStep): string {
    switch (step) {
      case "relevance-filter":
        return "Filtering for relevant documents...";
      case "documents-synthesis":
        return "Creating a unified synthesis...";
      case "report-extraction":
        return "Extracting key details and action items...";
      default:
        return `Processing step: ${step}...`;
    }
  }
}
