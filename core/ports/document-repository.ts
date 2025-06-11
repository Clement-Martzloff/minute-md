import { Document } from "@/core/domain/document";

export interface DocumentRepository {
  getContents(documentIds: string[]): Promise<Document[]>;
}
