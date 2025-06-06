import { Document } from "@/core/domain/document";
import { MeetingReportGenerator } from "@/core/ports/meeting-report-generator";
import { DocumentsLoaderNode } from "@/infrastructure/framework/langchain/documents-loader-node";
import { DocumentsSummarizerNode } from "@/infrastructure/framework/langchain/documents-summarizer-node";
import { Annotation } from "@/infrastructure/framework/langchain/meeting-report-annotation";
import { END, START, StateGraph } from "@langchain/langgraph";

export class LanggraphMeetingReportGenerator implements MeetingReportGenerator {
  constructor(
    private annotation: Annotation,
    private documentsLoader: DocumentsLoaderNode,
    private documentsSummarizer: DocumentsSummarizerNode
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async generate(documents: Document[]): Promise<any> {
    const workflow = new StateGraph(this.annotation)
      .addNode(
        "load_documents",
        this.documentsLoader.load.bind(this.documentsLoader)
      )
      .addNode(
        "summarize_documents",
        this.documentsSummarizer.summarize.bind(this.documentsSummarizer)
      )
      .addEdge(START, "load_documents")
      .addEdge("load_documents", "summarize_documents")
      .addEdge("summarize_documents", END);

    const app = workflow.compile();

    return await app.invoke({
      document_ids: documents.map((doc) => doc.id),
    });
  }
}
