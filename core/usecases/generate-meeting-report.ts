import { Document } from "@/core/domain/document";
import {
  ErrorEvent,
  PipelineEndEvent,
  PipelineStartEvent,
  ProcessingEvent,
  ProcessingRuleError,
  StepEndEvent,
  StepStartEvent,
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
        switch (chunk.type) {
          case "pipeline-start":
            yield new PipelineStartEvent("Process is starting...");
            break;

          case "step-start":
            yield new StepStartEvent(
              chunk.stepName,
              this.getMessageForStep(chunk.stepName, "start")
            );
            break;

          case "step-end":
            yield new StepEndEvent(
              chunk.stepName,
              this.getMessageForStep(chunk.stepName, "end")
            );
            break;

          case "pipeline-end":
            const finalState = chunk.state;
            const finalReport = finalState.meetingReportDraft || null;

            // Determine final status
            const status = finalReport
              ? "success"
              : finalState.failureReason // The log shows failureReason is set
              ? "irrelevant"
              : "error";

            // Generate final message based on status
            let finalMessage = "Process has finished.";
            if (status === "success") {
              finalMessage =
                "Process finished successfully. The report is ready.";
            } else if (status === "irrelevant") {
              finalMessage = `Process finished: ${finalState.failureReason}`;
            } else {
              finalMessage = "Process failed due to an unexpected error.";
            }

            yield new PipelineEndEvent(status, finalMessage, finalReport);
            return; // The use case's job is done.
        }
      }
    } catch (error) {
      if (error instanceof ProcessingRuleError) {
        throw error;
      }
      console.error(error);
      const err = error instanceof Error ? error : new Error(String(error));
      yield new ErrorEvent("runtime", err);
    }
  }

  private getMessageForStep(
    step: MeetingReportGenerationStep,
    phase: "start" | "end"
  ): string {
    const messages = {
      "relevance-filter": {
        start: "Filtering for relevant documents...",
        end: "Document filtering complete.",
      },
      "documents-synthesis": {
        start: "Creating a unified synthesis from documents...",
        end: "Synthesis complete.",
      },
      "report-extraction": {
        start: "Extracting key details for the final report...",
        end: "Report extraction complete.",
      },
    };
    return messages[step][phase];
  }
}
