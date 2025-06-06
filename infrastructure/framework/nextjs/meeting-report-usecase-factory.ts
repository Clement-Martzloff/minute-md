import { GenerateMeetingReportUseCase } from "@/core/usecases/generate-meeting-report";
import { GoogleDriveDocumentRepository } from "@/infrastructure/adapters/google-drive-document-repository";
import { GoogleGeminiTokenCounterFallback } from "@/infrastructure/adapters/google-gemini-token-counter-fallback";
import { LanggraphMeetingReportGenerator } from "@/infrastructure/adapters/langgraph-meeting-report-generator";
import { DocumentsLoaderNode } from "@/infrastructure/framework/langchain/documents-loader-node";
import { DocumentsSummarizerNode } from "@/infrastructure/framework/langchain/documents-summarizer-node";
import { GoogleGenerativeAIFactory } from "@/infrastructure/framework/langchain/google-generative-ai-factory";
import { MeetingReportAnnotationFactory } from "@/infrastructure/framework/langchain/meeting-report-annotation";
import { OAuth2Client } from "google-auth-library";

export class MeetingReportUseCaseFactory {
  public static create(
    oauthClient: OAuth2Client
  ): GenerateMeetingReportUseCase {
    const llmModel = GoogleGenerativeAIFactory.create();
    const annotation = MeetingReportAnnotationFactory.create();

    const repository = new GoogleDriveDocumentRepository(oauthClient);

    const loaderNode = new DocumentsLoaderNode(repository);
    const summarizerNode = new DocumentsSummarizerNode(llmModel);

    const generator = new LanggraphMeetingReportGenerator(
      annotation,
      loaderNode,
      summarizerNode
    );
    const tokenCounter = new GoogleGeminiTokenCounterFallback();

    return new GenerateMeetingReportUseCase(generator, tokenCounter);
  }
}
