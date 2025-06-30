import { DocumentContentExtractor } from "@/core/ports/document-content-extractor";
import mammoth from "mammoth";
import pdf from "pdf-parse";

export class FileContentExtractor implements DocumentContentExtractor {
  async extract(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (file.type === "text/plain") {
      return file.text();
    } else if (file.type === "application/pdf") {
      const data = await pdf(buffer);
      return data.text;
    } else if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/msword"
    ) {
      const result = await mammoth.extractRawText({ buffer: buffer });
      return result.value;
    } else {
      throw new Error(`Unsupported file type: ${file.type}`);
    }
  }
}
