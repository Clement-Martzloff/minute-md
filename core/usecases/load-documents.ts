import { Document } from "@/core/entities/document";
import { DocumentRepository } from "@/core/ports/document-repository";
import { TokenCounter } from "@/core/ports/token-counter";

export class TooManyDocumentsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TooManyDocumentsError";
  }
}

export class DocumentsTooLargeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DocumentsTooLargeError";
  }
}

export class DocumentContentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DocumentContentError";
  }
}

export class LoadDocumentsUseCase {
  private readonly MAX_DOCUMENTS = 5;
  private readonly MAX_TOKENS_PER_DOCUMENT = 100_000;
  private readonly MAX_TOTAL_SIZE_BYTES = 100 * 1024 * 1024;

  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly tokenCounter: TokenCounter
  ) {}

  public async execute(
    initialDocuments: Pick<Document, "id" | "name">[]
  ): Promise<Document[]> {
    if (initialDocuments.length > this.MAX_DOCUMENTS) {
      throw new TooManyDocumentsError(
        `Cannot process more than ${this.MAX_DOCUMENTS} documents. Received ${initialDocuments.length}.`
      );
    }

    const documentIds = initialDocuments.map((doc) => doc.id);
    const loadedDocuments = await this.documentRepository.getContents(
      documentIds
    );

    const tokensPerDoc = await Promise.all(
      loadedDocuments.map((doc) => this.tokenCounter.countTokens(doc.content!))
    );

    for (let i = 0; i < tokensPerDoc.length; i++) {
      if (tokensPerDoc[i] > this.MAX_TOKENS_PER_DOCUMENT) {
        throw new DocumentContentError(
          `Document "${loadedDocuments[i].name}" exceeds the maximum token limit.`
        );
      }
    }

    const totalContentSize = loadedDocuments.reduce(
      (sum, doc) => sum + new TextEncoder().encode(doc.content).length,
      0
    );

    if (totalContentSize > this.MAX_TOTAL_SIZE_BYTES) {
      throw new DocumentsTooLargeError(
        "Total size of documents exceeds the limit."
      );
    }

    console.log("All documents loaded and validated successfully.");
    return loadedDocuments;
  }
}
