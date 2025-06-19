import { Document } from "@/core/domain/document";
import { MeetingReport } from "@/core/domain/meeting";
import {
  MeetingProcessorStreamChunk,
  MeetingReportGenerationStep,
  MeetingReportProcessor,
  MeetingReportState,
} from "@/core/ports/meeting-report-processor";
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
  synthesizedText: Annotation<string | undefined>({
    reducer: (_, v) => v,
    default: () => undefined,
  }),
  meetingReportDraft: Annotation<MeetingReport | undefined>({
    reducer: (_, v) => v,
    default: () => undefined,
  }),
});
export type MeetingReportStateAnnotation = typeof MeetingReportAnnotation.State;

export class LangchainMeetingReportProcessor implements MeetingReportProcessor {
  private graph;
  private readonly nodeNames = {
    relevance: "relevance_filter_node",
    synthesis: "synthesis_node",
    extraction: "extraction_node",
  };
  private readonly nodesSet: Set<string>;

  constructor(
    private relevanceFilter: LangchainNode<MeetingReportStateAnnotation>,
    private documentsSynthesizer: LangchainNode<MeetingReportStateAnnotation>,
    private reportExtractor: LangchainNode<MeetingReportStateAnnotation>
  ) {
    const workflow = new StateGraph(MeetingReportAnnotation.spec)
      .addNode(
        this.nodeNames.relevance,
        this.relevanceFilter.run.bind(this.relevanceFilter)
      )
      .addNode(
        this.nodeNames.synthesis,
        this.documentsSynthesizer.run.bind(this.documentsSynthesizer)
      )
      .addNode(
        this.nodeNames.extraction,
        this.reportExtractor.run.bind(this.reportExtractor)
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

  public async *stream(
    documents: Document[]
  ): AsyncGenerator<MeetingProcessorStreamChunk> {
    console.log("Langchain Adapter: Starting v2 event stream...");

    const stream = this.graph.streamEvents({ documents }, { version: "v2" });

    for await (const { event, data, name } of stream) {
      if (name === "LangGraph" && event === "on_chain_start") {
        console.log("[Processor] Pipeline START");
        yield { type: "pipeline-start" };
      }

      if (this.nodesSet.has(name) && event === "on_chain_start") {
        const stepName = this.toReportGenerationStep(name);
        console.log(`[Processor] Step START: ${stepName}`);
        yield { type: "step-start", stepName };
      }

      if (this.nodesSet.has(name) && event === "on_chain_end") {
        const stepName = this.toReportGenerationStep(name);
        console.log(`[Processor] Step END: ${stepName}`);
        yield { type: "step-end", stepName };
      }

      if (name === "LangGraph" && event === "on_chain_end") {
        console.log("[Processor] Pipeline END. Final state available.");

        const rawFinalState = data.output as MeetingReportStateAnnotation;

        // LangGraph can sometimes wrap the final output in an array
        const finalPayloadRaw = Array.isArray(rawFinalState)
          ? rawFinalState[0]
          : rawFinalState;

        if (finalPayloadRaw) {
          const finalState: MeetingReportState = {
            failureReason: finalPayloadRaw.failureReason,
            meetingReportDraft: finalPayloadRaw.meetingReportDraft,
          };

          yield { type: "pipeline-end", state: finalState };
        }
        return;
      }
    }
  }

  private toReportGenerationStep(
    internalNodeName: string
  ): MeetingReportGenerationStep {
    switch (internalNodeName) {
      case this.nodeNames.relevance:
        return "relevance-filter";
      case this.nodeNames.synthesis:
        return "documents-synthesis";
      case this.nodeNames.extraction:
        return "report-extraction";
      default:
        throw new Error(`Unknown internal node name: ${internalNodeName}`);
    }
  }
}
