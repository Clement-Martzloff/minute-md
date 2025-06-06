import { DocumentRepository } from "@/core/ports/document-repository";
import { AnnotationState } from "@/infrastructure/framework/langgraph/meeting-report-annotation";

export class LoadDocumentsNode {
  constructor(private repository: DocumentRepository) {}

  public async load(state: AnnotationState): Promise<Partial<AnnotationState>> {
    const { documentIds } = state;
    const loadedDocuments = await this.repository.getContents(documentIds);

    return { docs_content: loadedDocuments };
  }
}
