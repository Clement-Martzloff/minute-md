import { MeetingReport } from "@/core/domain/meeting";
import { MeetingReportGenerationStep } from "@/core/ports/meeting-report-processor";

export class ProcessingRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProcessingRuleError";

    // This is for maintaining the stack trace in V8 environments (Node.js, Chrome)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ProcessingRuleError);
    }
  }
}

export abstract class ProcessingEvent {
  abstract readonly type: string;
}

export class PipelineStartEvent extends ProcessingEvent {
  public readonly type = "pipeline-start";
  constructor(public readonly message: string) {
    super();
  }
}

export class StepStartEvent extends ProcessingEvent {
  public readonly type = "step-start";
  constructor(
    public readonly stepName: MeetingReportGenerationStep,
    public readonly message: string
  ) {
    super();
  }
}

export class StepEndEvent extends ProcessingEvent {
  public readonly type = "step-end";
  constructor(
    public readonly stepName: MeetingReportGenerationStep,
    public readonly message: string
  ) {
    super();
  }
}

export class PipelineEndEvent extends ProcessingEvent {
  public readonly type = "pipeline-end";
  constructor(
    public readonly status: "success" | "error" | "irrelevant",
    public readonly message: string, // Add a final message field
    public readonly finalReport: MeetingReport | null = null
  ) {
    super();
  }
}

export class ErrorEvent extends ProcessingEvent {
  public readonly type = "error";
  constructor(
    public readonly kind: "runtime" | "processing",
    public readonly error: Error
  ) {
    super();
  }
}
