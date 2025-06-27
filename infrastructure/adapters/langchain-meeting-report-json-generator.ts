import { Document } from "@/core/entities/document";
import {
  JsonGenerationEvent,
  JsonGenerationPipelineEnd,
  JsonGenerationStep,
  MeetingReportJsonGenerator,
  PipelineStart,
  StepEnd,
  StepStart,
} from "@/core/ports/meeting-report-json-generator";
import { MeetingReportJsonSchemaType } from "@/infrastructure/framework/langchain/nodes/meeting-report-json-schema";
import { LangchainNode } from "@/infrastructure/framework/langchain/types";
import { Annotation, END, START, StateGraph } from "@langchain/langgraph";

const MeetingReportAnnotation = Annotation.Root({
  documents: Annotation<Document[]>({
    reducer: (_, v) => v,
    default: () => [],
  }),
  failureReason: Annotation<string | undefined>({
    reducer: (_, v) => v,
    default: () => undefined,
  }),
  jsonReport: Annotation<MeetingReportJsonSchemaType | null>({
    reducer: (_, v) => v,
    default: () => null,
  }),
  synthesizedText: Annotation<string | undefined>({
    reducer: (_, v) => v,
    default: () => undefined,
  }),
});
export type MeetingReportStateAnnotation = typeof MeetingReportAnnotation.State;

export class LangchainMeetingReportJsonGenerator
  implements MeetingReportJsonGenerator
{
  private graph;
  private readonly nodeNames = {
    relevance: "documents_relevance_filter",
    synthesis: "documents_synthesis",
    extraction: "json_report_extraction",
  };
  private readonly nodesSet: Set<string>;

  constructor(
    private filter: LangchainNode<MeetingReportStateAnnotation>,
    private synthesizer: LangchainNode<MeetingReportStateAnnotation>,
    private extractor: LangchainNode<MeetingReportStateAnnotation>
  ) {
    const workflow = new StateGraph(MeetingReportAnnotation.spec)
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
    console.debug("[langchain extractor] Starting v2 event stream...");

    const stream = this.graph.streamEvents({ documents }, { version: "v2" });

    for await (const { event, data, name } of stream) {
      console.debug(`${event}: ${name}`);
      if (name === "LangGraph" && event === "on_chain_start") {
        console.debug("[langchain extractor] Pipeline START");
        yield new PipelineStart();
      }

      if (this.nodesSet.has(name) && event === "on_chain_start") {
        const stepName = this.toReportGenerationStep(name);
        console.debug(`[langchain extractor] Step ${stepName} START`);
        yield new StepStart(stepName);
      }

      if (this.nodesSet.has(name) && event === "on_chain_end") {
        const stepName = this.toReportGenerationStep(name);
        console.debug(`[langchain extractor] Step ${stepName} END`);
        yield new StepEnd(stepName);
      }

      if (name === "LangGraph" && event === "on_chain_end") {
        console.debug(
          "[langchain extractor] Pipeline END. Final state available."
        );

        const finalState = data.output as MeetingReportStateAnnotation;

        if (finalState.failureReason && finalState.documents.length === 0) {
          yield new JsonGenerationPipelineEnd(
            null,
            "irrelevant",
            finalState.failureReason
          );
          break;
        }

        if (finalState.failureReason) {
          yield new JsonGenerationPipelineEnd(
            null,
            "failure",
            finalState.failureReason
          );
          break;
        }

        yield new JsonGenerationPipelineEnd(finalState.jsonReport, "success");
      }
    }
    return undefined;
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
