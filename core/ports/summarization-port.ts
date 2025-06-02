export interface SummarizationPort {
  summarize(text: string): Promise<string>;
}
