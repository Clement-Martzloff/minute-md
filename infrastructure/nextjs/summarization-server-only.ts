import { SummarizeDocumentUseCase } from "@/core/usecases/summarize-document-usecase";
import { HuggingFaceSummarizationAdapter } from "@/infrastructure/huggingface/huggingface-summarization-adapter";
import "server-only";

export async function summarizeDocumentServerOnly(
  documentContent: string
): Promise<string> {
  const summarizationPort = new HuggingFaceSummarizationAdapter();
  const summarizeDocumentUseCase = new SummarizeDocumentUseCase(
    summarizationPort
  );

  const summary = await summarizeDocumentUseCase.execute(documentContent);

  return summary;
}
