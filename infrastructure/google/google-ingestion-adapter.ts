import { GoogleAuth } from "google-auth-library";
import { drive_v3, google } from "googleapis";

export async function listGoogleDocs(
  auth: GoogleAuth
): Promise<drive_v3.Schema$File[]> {
  const drive = google.drive({ version: "v3", auth });

  const res = await drive.files.list({
    q: "mimeType='application/vnd.google-apps.document'",
    fields: "files(id, name)",
  });
  const files = res.data.files;
  if (!files || files.length === 0) {
    return [];
  }
  return files;
}

export async function getGoogleDocContent(
  auth: GoogleAuth,
  documentId: string
): Promise<string> {
  const docs = google.docs({ version: "v1", auth });

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

export async function isDocumentCompatible(
  auth: GoogleAuth,
  documentId: string
): Promise<boolean> {
  try {
    const content = await getGoogleDocContent(auth, documentId);
    return content.trim().length > 0;
  } catch (error) {
    console.error(
      `Error checking compatibility for document ${documentId}:`,
      error
    );
    return false;
  }
}
