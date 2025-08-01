import { TokenCounter } from "@/core/ports/token-counter";

export class VeryRoughTokenCounter implements TokenCounter {
  async count(text: string): Promise<number> {
    if (!text) return 0;
    // WARNING: very rough estimate
    return Math.ceil(text.length / 4);
  }
}
