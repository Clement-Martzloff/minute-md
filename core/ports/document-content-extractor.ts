export interface DocumentContentExtractor {
  extract(file: File): Promise<string>;
}
