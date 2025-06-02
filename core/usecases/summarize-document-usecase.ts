import { SummarizationPort } from "@/core/ports/summarization-port";

export class SummarizeDocumentUseCase {
  constructor(private summarizationPort: SummarizationPort) {}

  async execute(documentContent: string): Promise<string> {
    return this.summarizationPort.summarize(documentContent);
  }
}
