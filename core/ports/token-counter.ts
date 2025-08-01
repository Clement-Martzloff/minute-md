export interface TokenCounter {
  count(text: string): Promise<number> | number;
}
