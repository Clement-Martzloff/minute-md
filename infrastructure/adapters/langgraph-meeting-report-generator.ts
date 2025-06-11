import { Document } from "@/core/domain/document";
import { MeetingReportGenerator } from "@/core/ports/meeting-report-generator";
import { DocumentsSummarizerNode } from "@/infrastructure/framework/langchain/documents-summarizer-node";
import { MeetingReportAnnotation } from "@/infrastructure/framework/langchain/meeting-report-annotation";
import { END, START, StateGraph } from "@langchain/langgraph";

export class LanggraphMeetingReportGenerator implements MeetingReportGenerator {
  constructor(
    private annotation: typeof MeetingReportAnnotation,
    private documentsSummarizer: DocumentsSummarizerNode
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async generate(documents: Document[]): Promise<any> {
    const workflow = new StateGraph(this.annotation)
      .addNode(
        "summarize_documents",
        this.documentsSummarizer.summarize.bind(this.documentsSummarizer)
      )
      .addEdge(START, "summarize_documents")
      .addEdge("summarize_documents", END);

    const app = workflow.compile();

    return await app.invoke({ documents });
  }
}
