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
    public readonly message: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public readonly finalReport: Record<string, any> | null = null
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

export class StepChunkEvent extends ProcessingEvent {
  public readonly type = "step-chunk";

  constructor(
    public readonly stepName: MeetingReportGenerationStep,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public readonly chunk: Record<string, any>
  ) {
    super();
  }
}

export class ReportEndEvent extends ProcessingEvent {
  public readonly type = "report-end";
  constructor(public readonly message: string) {
    super();
  }
}
