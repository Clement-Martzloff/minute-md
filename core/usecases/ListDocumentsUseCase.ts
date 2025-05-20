import { Document, DocumentRepository } from "@/core/ports/DocumentRepository";

export class ListDocumentsUseCase {
  constructor(private repository: DocumentRepository) {}

  async execute(): Promise<Document[]> {
    return this.repository.listDocuments();
  }
}
