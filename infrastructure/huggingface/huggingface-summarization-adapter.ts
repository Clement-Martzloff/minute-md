import { SummarizationPort } from "@/core/ports/summarization-port";

export class HuggingFaceSummarizationAdapter implements SummarizationPort {
  async summarize(text: string): Promise<string> {
    return `Summarized text placeholder for: "${text.substring(0, 100)}..."`;
  }
}
