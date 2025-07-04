import { GenerateReportUseCase } from "@/core/usecases/generate-report";
import { LoadSelectedFilesUseCase } from "@/core/usecases/load-selected-files";
import { ConsoleLogger } from "@/infrastructure/console-logger";
import { FileContentExtractor } from "@/infrastructure/file-content-extractor";
import { DocumentsRelevanceFilter } from "@/infrastructure/generators/langchain/documents-relevance-filter";
import { DocumentsSynthesizer } from "@/infrastructure/generators/langchain/documents-synthesizer";
import { JsonReportExtractor } from "@/infrastructure/generators/langchain/json-report-extractor";
import { LangchainJsonGenerator } from "@/infrastructure/generators/langchain/langchain-json-generator";
import { UnifiedMarkdownGenerator } from "@/infrastructure/generators/unified-markdown-generator";
import { GoogleChatModelFactory } from "@/infrastructure/google-chat-model-factory";
import { VeryRoughTokenCounter } from "@/infrastructure/very-rough-token-counter";
import { container } from "@/ioc/container";

export function setupDI() {
  container.registerClass("Logger", ConsoleLogger);

  container.register(
    "ChatModelFactory",
    () =>
      new GoogleChatModelFactory({
        apiKey: process.env.CHAT_GOOGLE_GENERATIVE_AI_API_KEY!,
      }),
  );

  container.registerClass("TokenCounter", VeryRoughTokenCounter);

  container.register("DocumentsRelevanceFilterChatModel", (container) =>
    container
      .resolve("ChatModelFactory")
      .create({ model: "gemini-2.5-flash-preview-05-20", temperature: 0 }),
  );

  container.register("DocumentsSynthesizerChatModel", (container) =>
    container
      .resolve("ChatModelFactory")
      .create({ model: "gemini-2.5-flash-preview-05-20", temperature: 0 }),
  );

  container.register("JsonReportExtractorChatModel", (container) =>
    container
      .resolve("ChatModelFactory")
      .create({ model: "gemini-2.5-flash-preview-05-20", temperature: 0 }),
  );

  container.registerClass(
    "DocumentsRelevanceFilter",
    DocumentsRelevanceFilter,
    ["DocumentsRelevanceFilterChatModel"],
  );

  container.registerClass("DocumentsSynthesizer", DocumentsSynthesizer, [
    "DocumentsSynthesizerChatModel",
  ]);

  container.registerClass("JsonReportExtractor", JsonReportExtractor, [
    "JsonReportExtractorChatModel",
  ]);

  container.registerClass("JsonGenerator", LangchainJsonGenerator, [
    "DocumentsRelevanceFilter",
    "DocumentsSynthesizer",
    "JsonReportExtractor",
  ]);

  container.register(
    "MarkdownGenerator",
    () => new UnifiedMarkdownGenerator({ chunkSize: 1, delayMs: 10 }),
  );

  container.registerClass("ContentExtractor", FileContentExtractor);

  container.registerClass("GenerateReportUseCase", GenerateReportUseCase, [
    "JsonGenerator",
    "MarkdownGenerator",
  ]);

  container.registerClass("LoadSelectedFiles", LoadSelectedFilesUseCase, [
    "ContentExtractor",
    "TokenCounter",
  ]);

  return container;
}
