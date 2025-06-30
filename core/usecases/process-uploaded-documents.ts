import { Document } from "@/core/entities/document";
import { DocumentContentExtractor } from "@/core/ports/document-content-extractor";
import { FileItem } from "@/src/app/project/components/file-uploader/types";

export class ProcessUploadedDocumentsUseCase {
  constructor(private documentContentExtractor: DocumentContentExtractor) {}

  async execute(fileItems: FileItem[]): Promise<Document[]> {
    const documents: Document[] = [];

    for (const fileItem of fileItems) {
      if (!fileItem.file) {
        continue;
      }

      try {
        const content = await this.documentContentExtractor.extract(
          fileItem.file
        );
        const document = new Document({
          id: fileItem.id,
          name: fileItem.name,
          content: content,
          metadata: {
            size: fileItem.size,
            type: fileItem.type,
          },
        });

        documents.push(document);
      } catch (error) {
        console.error(`Failed to process file ${fileItem.name}:`, error);
      }
    }

    return documents;
  }
}
