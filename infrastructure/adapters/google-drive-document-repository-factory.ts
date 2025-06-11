import { DocumentRepository } from "@/core/ports/document-repository";
import { Logger } from "@/core/ports/logger";
import { GoogleDriveDocumentRepository } from "@/infrastructure/adapters/google-drive-document-repository";
import { GoogleOAuth2ClientFactory } from "@/infrastructure/google/google-oauth2-client-factory";

export interface DocumentRepositoryFactory {
  create(accessToken: string): DocumentRepository;
}

export class GoogleDocumentRepositoryFactory
  implements DocumentRepositoryFactory
{
  constructor(
    private readonly oauth2ClientFactory: GoogleOAuth2ClientFactory,
    private readonly logger: Logger
  ) {}

  public create(accessToken: string): DocumentRepository {
    const oauth2Client = this.oauth2ClientFactory.create(accessToken);
    return new GoogleDriveDocumentRepository(oauth2Client, this.logger);
  }
}
