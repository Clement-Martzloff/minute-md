import { Document } from "@/core/domain/document";
import { MeetingReportProcessor } from "@/core/ports/meeting-report-processor";
import { DocumentSynthesizerNode } from "@/infrastructure/framework/langchain/documents-synthesizer-node";
import { MeetingReportAnnotation } from "@/infrastructure/framework/langchain/meeting-report-annotation";
import { RelevanceCheckNode } from "@/infrastructure/framework/langchain/relevance-check-node";
import { END, START, StateGraph } from "@langchain/langgraph";

export class LanggraphMeetingReportProcessor implements MeetingReportProcessor {
  constructor(
    private annotation: typeof MeetingReportAnnotation,
    private documentsSynthesizer: DocumentSynthesizerNode,
    private relevanceCheck: RelevanceCheckNode
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async process(documents: Document[]): Promise<any> {
    const workflow = new StateGraph(this.annotation)
      .addNode(
        "relevance_check",
        this.relevanceCheck.check.bind(this.relevanceCheck)
      )
      .addNode(
        "synthesize_documents",
        this.documentsSynthesizer.synthesize.bind(this.documentsSynthesizer)
      )
      .addEdge(START, "relevance_check")
      .addConditionalEdges(
        "relevance_check",
        (state) => (state.isRelevant ? "synthesize_documents" : END),
        ["synthesize_documents", END]
      )
      .addEdge("synthesize_documents", END);

    const app = workflow.compile();

    return await app.invoke({ documents });
  }
}
