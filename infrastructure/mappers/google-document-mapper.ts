import { Document, InvalidDocumentNameError } from "@/core/domain/document";
import { DocumentMapper } from "@/core/ports/document-mapper";

export class GoogleDocumentMapper
  implements
    DocumentMapper<google.picker.DocumentObject & { selected: boolean }>
{
  public mapMultiple(
    googleDocuments: (google.picker.DocumentObject & { selected: boolean })[]
  ): Document[] {
    return googleDocuments
      .map((googleDoc) => {
        try {
          return new Document({
            id: googleDoc.id,
            name: googleDoc.name,
            metadata: { mimeType: googleDoc.mimeType },
          });
        } catch (error) {
          if (error instanceof InvalidDocumentNameError) {
            console.error(
              `Skipping document due to invalid name: ${googleDoc.id} - ${error.message}`
            );
            return null;
          }
          throw error;
        }
      })
      .filter((doc): doc is Document => doc !== null);
  }
}
