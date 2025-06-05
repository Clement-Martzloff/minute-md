import { Document } from "@/core/domain/document";
import { DocumentRepository } from "@/core/ports/document-repository";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

export class GoogleDriveDocumentRepository implements DocumentRepository {
  constructor(private auth: OAuth2Client) {}

  private async getDocumentContent(
    documentId: string
  ): Promise<Document | null> {
    const drive = google.drive({ version: "v3", auth: this.auth });
    const docs = google.docs({ version: "v1", auth: this.auth });

    try {
      const fileRes = await drive.files.get({
        fileId: documentId,
        fields: "id, name, mimeType, createdTime, modifiedTime, trashed",
      });

      const file = fileRes.data;

      if (file.trashed) {
        console.warn(`File ${documentId} is in trash and cannot be accessed.`);
        return null;
      }

      if (file.mimeType !== "application/vnd.google-apps.document") {
        console.warn(
          `File ${documentId} is not a Google Docs document. Found mimeType: ${file.mimeType}`
        );
        return null;
      }

      const docRes = await docs.documents.get({
        documentId: documentId,
      });

      const content = docRes.data.body?.content;
      let text = "";

      if (content) {
        for (const element of content) {
          if (element.paragraph) {
            for (const paragraphElement of element.paragraph.elements || []) {
              if (paragraphElement.textRun) {
                text += paragraphElement.textRun.content;
              }
            }
          }
        }
      }

      return new Document({
        id: documentId,
        name: file.name || "Untitled Document",
        content: text,
        metadata: {
          createdTime: file.createdTime,
          modifiedTime: file.modifiedTime,
        },
      });
    } catch (error) {
      console.error(
        `Failed to retrieve content for file ${documentId}:`,
        error
      );
      return null;
    }
  }

  public async getContents(documentIds: string[]): Promise<Document[]> {
    const promises = documentIds.map((documentId) =>
      this.getDocumentContent(documentId)
    );
    const documents = await Promise.all(promises);
    return documents.filter((doc): doc is Document => doc !== null);
  }
}
