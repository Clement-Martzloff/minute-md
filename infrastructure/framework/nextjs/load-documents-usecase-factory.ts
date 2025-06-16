// src/infrastructure/framework/nextjs/load-documents-usecase-factory.ts

import { DocumentRepository } from "@/core/ports/document-repository";
import { TokenCounter } from "@/core/ports/token-counter";
import { LoadDocumentsUseCase } from "@/core/usecases/load-documents";
import { GoogleDocumentRepositoryContext } from "@/infrastructure/adapters/google-drive-document-repository-factory";
import { RuntimeDependencyFactory } from "@/infrastructure/di/types";

export interface LoadDocumentsUsecaseContext {
  accessToken: string;
}

export class LoadDocumentsUseCaseFactory
  implements
    RuntimeDependencyFactory<LoadDocumentsUsecaseContext, LoadDocumentsUseCase>
{
  constructor(
    private documentRepositoryFactory: RuntimeDependencyFactory<
      GoogleDocumentRepositoryContext,
      DocumentRepository
    >,
    private tokenCounter: TokenCounter
  ) {}

  public create({
    accessToken,
  }: LoadDocumentsUsecaseContext): LoadDocumentsUseCase {
    const documentRepository = this.documentRepositoryFactory.create({
      accessToken,
    });

    return new LoadDocumentsUseCase(documentRepository, this.tokenCounter);
  }
}
