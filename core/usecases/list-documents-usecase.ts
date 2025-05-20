import { Document, DocumentRepository } from "@/core/ports/document-repository";

export class ListDocumentsUseCase {
  constructor(private repository: DocumentRepository) {}

  async execute(): Promise<Document[]> {
    return this.repository.listDocuments();
  }
}
