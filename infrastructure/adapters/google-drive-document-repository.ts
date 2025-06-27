import { Document } from "@/core/entities/document";
import { DocumentRepository } from "@/core/ports/document-repository";
import { Logger } from "@/core/ports/logger";
import { OAuth2Client } from "google-auth-library";
import { docs_v1, drive_v3, google } from "googleapis";

export class GoogleDriveDocumentRepository implements DocumentRepository {
  private readonly drive: drive_v3.Drive;
  private readonly docs: docs_v1.Docs;

  constructor(
    private readonly auth: OAuth2Client,
    private readonly logger: Logger
  ) {
    this.drive = google.drive({ version: "v3", auth: this.auth });
    this.docs = google.docs({ version: "v1", auth: this.auth });
  }

  public async getContents(documentIds: string[]): Promise<Document[]> {
    const promises = documentIds.map((id) => this.getDocumentContent(id));
    const documents = await Promise.all(promises);
    return documents.filter((doc): doc is Document => doc !== null);
  }

  private async getDocumentContent(
    documentId: string
  ): Promise<Document | null> {
    try {
      const fileRes = await this.drive.files.get({
        fileId: documentId,
        fields: "id, name, mimeType, createdTime, modifiedTime, trashed",
      });
      const file = fileRes.data;

      if (file.trashed) {
        this.logger.warn(`File ${documentId} is in trash; skipping.`);
        return null;
      }
      if (file.mimeType !== "application/vnd.google-apps.document") {
        this.logger.warn(
          `File ${documentId} is not a Google Doc (mimeType: ${file.mimeType}); skipping.`
        );
        return null;
      }

      const docRes = await this.docs.documents.get({ documentId });
      const textContent = this.extractTextFromDoc(docRes.data);

      return new Document({
        id: documentId,
        name: file.name || "Untitled Document",
        content: textContent,
        metadata: {
          createdTime: file.createdTime,
          modifiedTime: file.modifiedTime,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to retrieve content for file ${documentId}`, {
        error,
      });
      return null;
    }
  }

  private extractTextFromDoc(doc: docs_v1.Schema$Document): string {
    let text = "";
    const content = doc.body?.content;

    if (!content) {
      return text;
    }

    for (const element of content) {
      if (element.paragraph) {
        element.paragraph.elements?.forEach((paragraphElement) => {
          if (paragraphElement.textRun?.content) {
            text += paragraphElement.textRun.content;
          }
        });
      }
    }
    return text;
  }
}
