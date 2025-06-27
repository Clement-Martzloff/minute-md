import { Document } from "@/core/entities/document";

export interface DocumentMapper<TInput> {
  mapMultiple(sources: TInput[]): Document[];
}
