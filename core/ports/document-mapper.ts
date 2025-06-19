import { Document } from "@/core/domain/document";

export interface DocumentMapper<TInput> {
  mapMultiple(sources: TInput[]): Document[];
}
