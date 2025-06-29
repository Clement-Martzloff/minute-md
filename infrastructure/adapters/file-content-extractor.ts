import { DocumentContentExtractor } from "@/core/ports/document-content-extractor";

export class FileContentExtractor implements DocumentContentExtractor {
  async extract(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error("Failed to read file content."));
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      // Handle different file types
      if (file.type === "text/plain") {
        reader.readAsText(file);
      } else if (
        file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword"
      ) {
        // For PDF and DOCX, a more sophisticated library would be needed on the server-side
        // For now, we'll just read them as text, which will likely result in garbled content
        // In a real application, you'd use a library like 'pdf-parse' or 'mammoth.js'
        reader.readAsText(file);
      } else {
        reject(new Error(`Unsupported file type: ${file.type}`));
      }
    });
  }
}
