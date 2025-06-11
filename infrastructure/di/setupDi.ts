import { GenerateMeetingReportUseCase } from "@/core/usecases/generate-meeting-report";
import { ConsoleLogger } from "@/infrastructure/adapters/console-logger";
import { GoogleDocumentRepositoryFactory } from "@/infrastructure/adapters/google-drive-document-repository-factory";
import { GoogleGeminiTokenCounterFallback } from "@/infrastructure/adapters/google-gemini-token-counter-fallback";
import { LanggraphMeetingReportGenerator } from "@/infrastructure/adapters/langgraph-meeting-report-generator";
import { container } from "@/infrastructure/di/container";
import { DocumentsSummarizerNode } from "@/infrastructure/framework/langchain/documents-summarizer-node";
import { GoogleAIModelFactory } from "@/infrastructure/framework/langchain/google-ai-model-factory";
import { MeetingReportAnnotation } from "@/infrastructure/framework/langchain/meeting-report-annotation";
import { LoadDocumentsUseCaseFactory } from "@/infrastructure/framework/nextjs/load-documents-factory";
import { GoogleOAuth2ClientFactory } from "@/infrastructure/google/google-oauth2-client-factory";

export function setupDI() {
  container.registerClass("Logger", ConsoleLogger);

  container.register(
    "GoogleOAuth2ClientFactory",
    () =>
      new GoogleOAuth2ClientFactory({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        redirectUri: process.env.GOOGLE_REDIRECT_URI!,
      })
  );

  container.register(
    "GoogleAIModelFactory",
    () =>
      new GoogleAIModelFactory({
        apiKey: process.env.CHAT_GOOGLE_GENERATIVE_AI_API_KEY!,
        defaultModel: "gemini-1.5-flash-latest",
        defaultTemperature: 0.5,
      })
  );

  container.registerClass("TokenCounter", GoogleGeminiTokenCounterFallback);

  container.registerClass(
    "DocumentRepositoryFactory",
    GoogleDocumentRepositoryFactory,
    ["GoogleOAuth2ClientFactory", "Logger"]
  );

  container.register("SummarizerGoogleAIModel", (container) =>
    container
      .resolve("GoogleAIModelFactory")
      .create({ model: "gemini-2.5-flash-preview-05-20" })
  );

  container.registerClass("DocumentsSummarizerNode", DocumentsSummarizerNode, [
    "SummarizerGoogleAIModel",
  ]);

  container.registerValue("MeetingReportAnnotation", MeetingReportAnnotation);

  container.registerClass(
    "MeetingReportGenerator",
    LanggraphMeetingReportGenerator,
    ["MeetingReportAnnotation", "DocumentsSummarizerNode"]
  );

  container.registerClass(
    "LoadDocumentsUseCaseFactory",
    LoadDocumentsUseCaseFactory,
    ["DocumentRepositoryFactory", "TokenCounter"]
  );

  container.registerClass(
    "GenerateMeetingReportUseCase",
    GenerateMeetingReportUseCase,
    ["MeetingReportGenerator"]
  );

  return container;
}
