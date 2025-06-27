import { Document } from "@/core/entities/document";

export interface DocumentRepository {
  getContents(documentIds: string[]): Promise<Document[]>;
}
