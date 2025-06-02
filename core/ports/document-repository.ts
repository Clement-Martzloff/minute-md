export interface Document {
  id: string;
  name: string;
}

export interface DocumentRepository {
  listDocuments(): Promise<Document[]>;
  getContent(fileId: string): Promise<string>;
}
