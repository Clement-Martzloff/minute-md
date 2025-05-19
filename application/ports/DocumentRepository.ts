export interface Document {
  id: string;
  name: string;
}

export interface DocumentRepository {
  listDocuments(): Promise<Document[]>;
}
