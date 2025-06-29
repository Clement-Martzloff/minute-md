import { GenerateMeetingReportUseCase } from "@/core/usecases/generate-meeting-report";
import { ProcessUploadedDocumentsUseCase } from "@/core/usecases/process-uploaded-documents";
import { ConsoleLogger } from "@/infrastructure/adapters/console-logger";
import { FileContentExtractor } from "@/infrastructure/adapters/file-content-extractor";
import { GoogleDocumentRepositoryFactory } from "@/infrastructure/adapters/google-drive-document-repository-factory";
import { GoogleGeminiTokenCounter } from "@/infrastructure/adapters/google-gemini-token-counter";
import { LangchainMeetingReportJsonGenerator } from "@/infrastructure/adapters/langchain-meeting-report-json-generator";
import { UnifiedMeetingReportMarkdownGenerator } from "@/infrastructure/adapters/unified-meeting-report-markdown-generator";
import { container } from "@/infrastructure/di/container";
import { GoogleOAuth2ClientFactory } from "@/infrastructure/framework/google/google-oauth2-client-factory";
import { GoogleChatModelFactory } from "@/infrastructure/framework/langchain/google-chat-model-factory";
import { MeetingDocumentsRelevanceFilter } from "@/infrastructure/framework/langchain/nodes/meeting-documents-relevance-filter";
import { MeetingDocumentsSynthesizer } from "@/infrastructure/framework/langchain/nodes/meeting-documents-synthesizer";
import { MeetingReportJsonExtractor } from "@/infrastructure/framework/langchain/nodes/meeting-report-json-extractor";
import { LoadDocumentsUseCaseFactory } from "@/infrastructure/framework/nextjs/load-documents-usecase-factory";
import { GoogleDocumentMapper } from "@/infrastructure/mappers/google-document-mapper";
import { GoogleDocumentZodParser } from "@/infrastructure/parsers/google-document-zod-parser";

export function setupDI() {
  container.registerClass("Logger", ConsoleLogger);

  container.register(
    "OAuth2ClientFactory",
    () =>
      new GoogleOAuth2ClientFactory({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        redirectUri: process.env.GOOGLE_REDIRECT_URI!,
      })
  );

  container.register(
    "ChatModelFactory",
    () =>
      new GoogleChatModelFactory({
        apiKey: process.env.CHAT_GOOGLE_GENERATIVE_AI_API_KEY!,
      })
  );

  container.registerClass("TokenCounter", GoogleGeminiTokenCounter);

  container.registerClass(
    "DocumentRepositoryFactory",
    GoogleDocumentRepositoryFactory,
    ["OAuth2ClientFactory", "Logger"]
  );

  container.register("MeetingDocumentsSynthesizerChatModel", (container) =>
    container
      .resolve("ChatModelFactory")
      .create({ model: "gemini-2.5-flash-preview-05-20", temperature: 0 })
  );

  container.register("MeetingDocumentsRelevanceFilterChatModel", (container) =>
    container
      .resolve("ChatModelFactory")
      .create({ model: "gemini-2.5-flash-preview-05-20", temperature: 0 })
  );

  container.register("MeetingReportJsonExtractorChatModel", (container) =>
    container
      .resolve("ChatModelFactory")
      .create({ model: "gemini-2.5-flash-preview-05-20", temperature: 0 })
  );

  container.registerClass(
    "MeetingDocumentsSynthesizerNode",
    MeetingDocumentsSynthesizer,
    ["MeetingDocumentsSynthesizerChatModel"]
  );

  container.registerClass(
    "MeetingDocumentsRelevanceFilterNode",
    MeetingDocumentsRelevanceFilter,
    ["MeetingDocumentsRelevanceFilterChatModel"]
  );

  container.registerClass(
    "MeetingReportJsonExtractorNode",
    MeetingReportJsonExtractor,
    ["MeetingReportJsonExtractorChatModel"]
  );

  container.registerClass(
    "MeetingReportJsonGenerator",
    LangchainMeetingReportJsonGenerator,
    [
      "MeetingDocumentsRelevanceFilterNode",
      "MeetingDocumentsSynthesizerNode",
      "MeetingReportJsonExtractorNode",
    ]
  );

  container.register(
    "MeetingReportMarkdownGenerator",
    () =>
      new UnifiedMeetingReportMarkdownGenerator({ chunkSize: 1, delayMs: 10 })
  );

  container.registerClass(
    "LoadDocumentsUseCaseFactory",
    LoadDocumentsUseCaseFactory,
    ["DocumentRepositoryFactory", "TokenCounter"]
  );

  container.registerClass(
    "GenerateMeetingReportUseCase",
    GenerateMeetingReportUseCase,
    ["MeetingReportJsonGenerator", "MeetingReportMarkdownGenerator"]
  );

  container.registerClass("GoogleDocumentMapper", GoogleDocumentMapper);

  container.registerClass("GoogleDocumentParser", GoogleDocumentZodParser, [
    "GoogleDocumentMapper",
  ]);

  // New registrations for file upload
  container.registerClass("DocumentContentExtractor", FileContentExtractor);
  container.registerClass(
    "ProcessUploadedDocumentsUseCase",
    ProcessUploadedDocumentsUseCase,
    ["DocumentContentExtractor"]
  );

  return container;
}
