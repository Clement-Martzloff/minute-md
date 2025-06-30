import { Document } from "@/core/entities/document";
import {
  JsonGenerationEvent,
  JsonGenerationStep,
  JsonGenerator,
  StepEnd,
  StepStart,
} from "@/core/ports/json-generator";
import { jsonReportSchemaType } from "@/infrastructure/generators/langchain/json-report-schema";
import { LangchainNode } from "@/infrastructure/generators/langchain/types";
import { Annotation, END, START, StateGraph } from "@langchain/langgraph";

const StateAnnotation = Annotation.Root({
  documents: Annotation<Document[]>({
    reducer: (_, v) => v,
    default: () => [],
  }),
  failureReason: Annotation<string | undefined>({
    reducer: (_, v) => v,
    default: () => undefined,
  }),
  jsonReport: Annotation<jsonReportSchemaType | null>({
    reducer: (_, v) => v,
    default: () => null,
  }),
  synthesizedText: Annotation<string | undefined>({
    reducer: (_, v) => v,
    default: () => undefined,
  }),
});
export type StateAnnotation = typeof StateAnnotation.State;

export class LangchainJsonGenerator implements JsonGenerator {
  private graph;
  private readonly nodeNames = {
    relevance: "documents_relevance_filter",
    synthesis: "documents_synthesis",
    extraction: "json_report_extraction",
  };
  private readonly nodesSet: Set<string>;

  constructor(
    private filter: LangchainNode<StateAnnotation>,
    private synthesizer: LangchainNode<StateAnnotation>,
    private extractor: LangchainNode<StateAnnotation>
  ) {
    const workflow = new StateGraph(StateAnnotation.spec)
      .addNode(this.nodeNames.relevance, this.filter.run.bind(this.filter))
      .addNode(
        this.nodeNames.synthesis,
        this.synthesizer.run.bind(this.synthesizer)
      )
      .addNode(
        this.nodeNames.extraction,
        this.extractor.run.bind(this.extractor)
      )
      .addEdge(START, this.nodeNames.relevance)
      .addConditionalEdges(this.nodeNames.relevance, (state) =>
        state.documents && state.documents.length > 0
          ? this.nodeNames.synthesis
          : END
      )
      .addEdge(this.nodeNames.synthesis, this.nodeNames.extraction)
      .addEdge(this.nodeNames.extraction, END);

    this.graph = workflow.compile();
    this.nodesSet = new Set(Object.values(this.nodeNames));
  }

  public async *generate(
    documents: Document[]
  ): AsyncGenerator<JsonGenerationEvent> {
    const stream = this.graph.streamEvents({ documents }, { version: "v2" });

    for await (const { event, data, name } of stream) {
      if (this.nodesSet.has(name) && event === "on_chain_start") {
        const stepName = this.toReportGenerationStep(name);

        yield new StepStart(stepName);
      }

      if (this.nodesSet.has(name) && event === "on_chain_end") {
        const stepName = this.toReportGenerationStep(name);

        const { failureReason, jsonReport } = data.output as StateAnnotation;

        yield new StepEnd(stepName, { jsonReport, failureReason });
      }
    }
  }

  private toReportGenerationStep(internalNodeName: string): JsonGenerationStep {
    switch (internalNodeName) {
      case this.nodeNames.relevance:
        return "documents-relevance-filter";
      case this.nodeNames.synthesis:
        return "documents-synthesis";
      case this.nodeNames.extraction:
        return "json-report-extraction";
      default:
        throw new Error(`Unknown internal node name: ${internalNodeName}`);
    }
  }
}
