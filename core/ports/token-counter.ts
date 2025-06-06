export interface TokenCounter {
  countTokens(text: string): Promise<number> | number;
}
