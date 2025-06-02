import { DocumentRepository } from "@/core/ports/document-repository";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

export class DriveRepository implements DocumentRepository {
  constructor(private auth: OAuth2Client) {}

  async listDocuments(): Promise<{ id: string; name: string }[]> {
    const drive = google.drive({ version: "v3", auth: this.auth });

    const res = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.document'",
      fields: "files(id, name)",
    });
    const files = res.data.files;
    if (!files || files.length === 0) {
      return [];
    }
    return files.map((file) => ({
      id: file.id!,
      name: file.name!,
    }));
  }

  async getGoogleDocContent(documentId: string): Promise<string> {
    const docs = google.docs({ version: "v1", auth: this.auth });

    const res = await docs.documents.get({
      documentId: documentId,
    });

    const content = res.data.body?.content;
    if (!content) {
      return "";
    }

    let text = "";
    for (const element of content) {
      if (element.paragraph) {
        for (const paragraphElement of element.paragraph.elements || []) {
          if (paragraphElement.textRun) {
            text += paragraphElement.textRun.content;
          }
        }
      }
    }
    return text;
  }

  async isDocumentCompatible(documentId: string): Promise<boolean> {
    try {
      const content = await this.getGoogleDocContent(documentId);
      return content.trim().length > 0;
    } catch (error) {
      console.error(
        `Error checking compatibility for document ${documentId}:`,
        error
      );
      return false;
    }
  }
}
