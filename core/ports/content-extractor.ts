export interface ContentExtractor {
  extract(file: File): Promise<string>;
}
