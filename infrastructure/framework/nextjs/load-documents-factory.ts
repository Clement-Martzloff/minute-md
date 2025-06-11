import { TokenCounter } from "@/core/ports/token-counter";
import { LoadDocumentsUseCase } from "@/core/usecases/load-documents";
import { DocumentRepositoryFactory } from "@/infrastructure/adapters/google-drive-document-repository-factory";

export class LoadDocumentsUseCaseFactory {
  constructor(
    private readonly docRepoFactory: DocumentRepositoryFactory,
    private readonly tokenCounter: TokenCounter
  ) {}

  public create(accessToken: string): LoadDocumentsUseCase {
    const repository = this.docRepoFactory.create(accessToken);
    return new LoadDocumentsUseCase(repository, this.tokenCounter);
  }
}
