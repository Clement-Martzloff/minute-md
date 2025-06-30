import { Document } from "@/core/entities/document";
import { ContentExtractor } from "@/core/ports/content-extractor";
import { TokenCounter } from "@/core/ports/token-counter";
import { FileItem } from "@/src/app/components/file-uploader/types";

class TooManyDocumentsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TooManyDocumentsError";
  }
}

class DocumentContentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DocumentContentError";
  }
}

export class LoadSelectedFilesUseCase {
  private readonly MAX_DOCUMENTS = 5;
  private readonly MAX_TOKENS_PER_DOCUMENT = 100_000;

  constructor(
    private extractor: ContentExtractor,
    private counter: TokenCounter
  ) {}

  async execute(fileItems: FileItem[]): Promise<Document[]> {
    if (fileItems.length > this.MAX_DOCUMENTS) {
      throw new TooManyDocumentsError(
        `Cannot process more than ${this.MAX_DOCUMENTS} documents. Received ${fileItems.length}.`
      );
    }

    const documents: Document[] = [];

    for (const fileItem of fileItems) {
      if (!fileItem.file) {
        continue;
      }

      try {
        const content = await this.extractor.extract(fileItem.file);
        const document = new Document({
          id: fileItem.id,
          name: fileItem.name,
          content: content,
          metadata: {
            size: fileItem.size,
            type: fileItem.type,
          },
        });

        const tokens = await this.counter.count(document.content!);
        if (tokens > this.MAX_TOKENS_PER_DOCUMENT) {
          throw new DocumentContentError(
            `Document "${document.name}" exceeds the maximum token limit.`
          );
        }

        documents.push(document);
      } catch (error) {
        console.error(`Failed to process file ${fileItem.name}:`, error);
        // Re-throw specific errors that should be handled by the caller
        if (
          error instanceof TooManyDocumentsError ||
          error instanceof DocumentContentError
        ) {
          throw error;
        }
      }
    }

    return documents;
  }
}
