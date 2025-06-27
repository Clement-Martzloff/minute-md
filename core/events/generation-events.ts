export abstract class GenerationEvent {
  abstract readonly type: string;
}

export class PipelineStart extends GenerationEvent {
  public readonly type = "pipeline-start";
  constructor() {
    super();
  }
}

export class StepStart<TStep> extends GenerationEvent {
  public readonly type = "step-start";
  constructor(public readonly stepName: TStep) {
    super();
  }
}

export class StepEnd<TStep> extends GenerationEvent {
  public readonly type = "step-end";
  constructor(public readonly stepName: TStep) {
    super();
  }
}

export class StepChunk<
  TStep,
  TChunk = Record<string, unknown>
> extends GenerationEvent {
  public readonly type = "step-chunk";
  constructor(public readonly stepName: TStep, public readonly chunk: TChunk) {
    super();
  }
}

export type PipelineEndStatus = "success" | "failure";

export class PipelineEnd<
  TResult = Record<string, unknown>,
  TStatus extends string = PipelineEndStatus
> extends GenerationEvent {
  public readonly type = "pipeline-end";
  constructor(
    public readonly result: TResult | null = null,
    public readonly status: TStatus
  ) {
    super();
  }
}
