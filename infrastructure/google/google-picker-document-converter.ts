import { Document, InvalidDocumentNameError } from "@/core/domain/document";

export class GooglePickerDocumentConverter {
  convert(
    pickerDocuments: (google.picker.DocumentObject & { selected: boolean })[]
  ): Document[] {
    return pickerDocuments
      .map((pickerDoc) => {
        try {
          return new Document({
            id: pickerDoc.id,
            name: pickerDoc.name,
            content: pickerDoc.url || "",
            metadata: {
              mimeType: pickerDoc.mimeType,
              iconUrl: pickerDoc.iconUrl,
            },
          });
        } catch (error) {
          if (error instanceof InvalidDocumentNameError) {
            console.error(
              `Skipping document due to invalid name: ${pickerDoc.id} - ${error.message}`
            );
            return null;
          }
          throw error;
        }
      })
      .filter((doc): doc is Document => doc !== null);
  }
}
