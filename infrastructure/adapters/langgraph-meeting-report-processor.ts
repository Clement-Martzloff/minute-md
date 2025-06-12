import { Document } from "@/core/domain/document";
import { MeetingReportProcessor } from "@/core/ports/meeting-report-processor";
import { DocumentsSummarizerNode } from "@/infrastructure/framework/langchain/documents-summarizer-node";
import { MeetingReportAnnotation } from "@/infrastructure/framework/langchain/meeting-report-annotation";
import { RelevanceCheckNode } from "@/infrastructure/framework/langchain/relevance-check-node";
import { END, START, StateGraph } from "@langchain/langgraph";

export class LanggraphMeetingReportProcessor implements MeetingReportProcessor {
  constructor(
    private annotation: typeof MeetingReportAnnotation,
    private documentsSummarizer: DocumentsSummarizerNode,
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
        "summarize_documents",
        this.documentsSummarizer.summarize.bind(this.documentsSummarizer)
      )
      .addEdge(START, "relevance_check")
      .addConditionalEdges(
        "relevance_check",
        (state) => (state.isRelevant ? "summarize_documents" : END),
        ["summarize_documents", END]
      )
      .addEdge("summarize_documents", END);

    const app = workflow.compile();

    return await app.invoke({ documents });
  }
}
