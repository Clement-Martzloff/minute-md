import { Document } from "@/core/domain/document";
import { MeetingReport } from "@/core/domain/meeting";
import {
  MeetingProcessorStreamChunk,
  MeetingReportGenerationStep,
  MeetingReportProcessor,
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
  }

  public async *stream(
    documents: Document[]
  ): AsyncGenerator<MeetingProcessorStreamChunk> {
    console.log(
      "Langchain Adapter: Starting stream and adapting to MeetingProcessorStreamChunk..."
    );

    for await (const chunk of await this.graph.stream(
      { documents },
      { streamMode: "updates" }
    )) {
      const [nodeName, state] = Object.entries(chunk)[0];
      const stepName = this.toReportGenerationStep(nodeName);

      yield { stepName, state };
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
      case "__end__":
        return "end";
      default:
        throw new Error(`Unknown internal node name: ${internalNodeName}`);
    }
  }
}
