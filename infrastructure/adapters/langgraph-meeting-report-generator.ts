import { Document } from "@/core/domain/document";
import { MeetingReportGenerator } from "@/core/ports/meeting-report-generator";
import { LoadDocumentsNode } from "@/infrastructure/framework/langgraph/documents-loader-node";
import { MeetingReportAnnotation } from "@/infrastructure/framework/langgraph/meeting-report-annotation";
import { START, StateGraph } from "@langchain/langgraph";

export class LanggraphMeetingReportGenerator implements MeetingReportGenerator {
  constructor(
    private annotation: typeof MeetingReportAnnotation,
    private documentsLoader: LoadDocumentsNode
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async generate(documents: Document[]): Promise<any> {
    const workflow = new StateGraph(this.annotation)
      .addNode(
        "load_documents",
        this.documentsLoader.load.bind(this.documentsLoader)
      )
      .addEdge(START, "load_documents");
    const app = workflow.compile();

    return await app.invoke({
      documentIds: documents.map((doc) => doc.id),
    });
  }
}
