import { GenerateMeetingReportUseCase } from "@/core/usecases/generate-meeting-report";
import { ConsoleLogger } from "@/infrastructure/adapters/console-logger";
import { GoogleDocumentRepositoryFactory } from "@/infrastructure/adapters/google-drive-document-repository-factory";
import { GoogleGeminiTokenCounter } from "@/infrastructure/adapters/google-gemini-token-counter";
import { LangchainMeetingReportProcessor } from "@/infrastructure/adapters/langchain-meeting-report-processor";
import { container } from "@/infrastructure/di/container";
import { GoogleOAuth2ClientFactory } from "@/infrastructure/framework/google/google-oauth2-client-factory";
import { GoogleChatModelFactory } from "@/infrastructure/framework/langchain/google-chat-model-factory";
import { MeetingDocumentsRelevanceFilter } from "@/infrastructure/framework/langchain/nodes/meeting-documents-relevance-filter";
import { MeetingDocumentsSynthesizer } from "@/infrastructure/framework/langchain/nodes/meeting-documents-synthesizer";
import { MeetingReportExtractor } from "@/infrastructure/framework/langchain/nodes/meeting-report-extractor";
import { LoadDocumentsUseCaseFactory } from "@/infrastructure/framework/nextjs/load-documents-usecase-factory";

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

  container.register("MeetingReportExtractorChatModel", (container) =>
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
    "MeetingReportExtractorNode",
    MeetingReportExtractor,
    ["MeetingReportExtractorChatModel"]
  );

  container.registerClass(
    "MeetingReportProcessor",
    LangchainMeetingReportProcessor,
    [
      "MeetingDocumentsRelevanceFilterNode",
      "MeetingDocumentsSynthesizerNode",
      "MeetingReportExtractorNode",
    ]
  );

  container.registerClass(
    "LoadDocumentsUseCaseFactory",
    LoadDocumentsUseCaseFactory,
    ["DocumentRepositoryFactory", "TokenCounter"]
  );

  container.registerClass(
    "GenerateMeetingReportUseCase",
    GenerateMeetingReportUseCase,
    ["MeetingReportProcessor"]
  );

  return container;
}
