import { DocumentRepository } from "@/core/ports/document-repository";
import { Annotation } from "@/infrastructure/framework/langchain/meeting-report-annotation";

export class DocumentsLoaderNode {
  constructor(private repository: DocumentRepository) {}

  public async load(
    state: Annotation["State"]
  ): Promise<Partial<Annotation["State"]>> {
    const { document_ids } = state;
    const loadedDocuments = await this.repository.getContents(document_ids);

    return { docs_content: loadedDocuments };
  }
}
