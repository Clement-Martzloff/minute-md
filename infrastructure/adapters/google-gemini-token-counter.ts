import { TokenCounter } from "@/core/ports/token-counter";

export class GoogleGeminiTokenCounter implements TokenCounter {
  async countTokens(text: string): Promise<number> {
    if (!text) return 0;
    // WARNING: very rough estimate
    return Math.ceil(text.length / 4);
  }
}
