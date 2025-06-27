import { Document } from "@/core/entities/document";

export interface DocumentParser {
  parseMultiple(data: unknown): Document[];
}

export class DocumentParserError extends Error {
  public readonly details: Record<string, string[] | undefined>;

  constructor(
    message: string,
    details: Record<string, string[] | undefined> = {}
  ) {
    super(message);
    this.name = "DocumentParserError";
    this.details = details;
  }
}
