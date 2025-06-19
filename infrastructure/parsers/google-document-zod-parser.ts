import { Document } from "@/core/domain/document";
import { DocumentMapper } from "@/core/ports/document-mapper";
import {
  DocumentParser,
  DocumentParserError,
} from "@/core/ports/document-parser";
import { z } from "zod";

const googleDocumentObjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  mimeType: z.string().min(1),
  selected: z.boolean(),
});

const googleDocumentsSchema = z.array(googleDocumentObjectSchema);

export class GoogleDocumentZodParser implements DocumentParser {
  constructor(
    private mapper: DocumentMapper<
      google.picker.DocumentObject & { selected: boolean }
    >
  ) {}

  public parseMultiple(data: unknown): Document[] {
    try {
      const parsed = googleDocumentsSchema.parse(data);
      return this.mapper.mapMultiple(parsed);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new DocumentParserError(
          "Invalid document data provided.",
          error.flatten().fieldErrors
        );
      }
      throw error;
    }
  }
}
