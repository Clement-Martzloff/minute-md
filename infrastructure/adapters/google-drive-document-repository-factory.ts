import { DocumentRepository } from "@/core/ports/document-repository";
import { Logger } from "@/core/ports/logger";
import { GoogleDriveDocumentRepository } from "@/infrastructure/adapters/google-drive-document-repository";
import { RuntimeDependencyFactory } from "@/infrastructure/di/types";
import { OAuth2ClientFactory } from "@/infrastructure/framework/google/google-oauth2-client-factory";

export interface GoogleDocumentRepositoryContext {
  accessToken: string;
}

export class GoogleDocumentRepositoryFactory
  implements
    RuntimeDependencyFactory<
      GoogleDocumentRepositoryContext,
      DocumentRepository
    >
{
  constructor(
    private oauth2ClientFactory: OAuth2ClientFactory,
    private logger: Logger
  ) {}

  public create({ accessToken }: GoogleDocumentRepositoryContext) {
    const oauth2Client = this.oauth2ClientFactory.create(accessToken);
    return new GoogleDriveDocumentRepository(oauth2Client, this.logger);
  }
}
