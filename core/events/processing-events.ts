import { MeetingReport } from "@/core/domain/meeting";

export class ProcessingRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProcessingRuleError";
  }
}

export abstract class ProcessingEvent {
  public readonly timestamp: Date;
  protected constructor(public readonly message: string) {
    this.timestamp = new Date();
  }
}

export class StepEndEvent extends ProcessingEvent {
  constructor(
    public readonly stepName: string, // e.g., 'relevance_filter'
    message: string
  ) {
    super(message);
  }
}

export class PipelineEndEvent extends ProcessingEvent {
  constructor(
    public readonly status: "success" | "irrelevant" | "error",
    public readonly result: MeetingReport | null,
    public readonly reason?: string // Explains why it was irrelevant or errored
  ) {
    super(`Pipeline finished with status: ${status}.`);
  }
}

export class ErrorEvent extends ProcessingEvent {
  constructor(
    public readonly stepName: string, // The step where the error occurred
    public readonly error: Error
  ) {
    super(`An error occurred during step: ${stepName}.`);
  }
}
