import { Logger } from "@/core/ports/logger";
import { MeetingReportGenerator } from "@/core/ports/meeting-report-generator";
import { TokenCounter } from "@/core/ports/token-counter";
import { GenerateMeetingReportUseCase } from "@/core/usecases/generate-meeting-report";
import { DocumentRepositoryFactory } from "@/infrastructure/adapters/google-drive-document-repository-factory";
import { DocumentsSummarizerNode } from "@/infrastructure/framework/langchain/documents-summarizer-node";
import { GoogleAIModelFactory } from "@/infrastructure/framework/langchain/google-ai-model-factory";
import { MeetingReportAnnotation } from "@/infrastructure/framework/langchain/meeting-report-annotation";
import { LoadDocumentsUseCaseFactory } from "@/infrastructure/framework/nextjs/load-documents-factory";
import { GoogleOAuth2ClientFactory } from "@/infrastructure/google/google-oauth2-client-factory";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export interface AppDependencies {
  GenerateMeetingReportUseCase: GenerateMeetingReportUseCase;
  Logger: Logger;
  MeetingReportGenerator: MeetingReportGenerator;
  TokenCounter: TokenCounter;

  DocumentRepositoryFactory: DocumentRepositoryFactory;
  DocumentsSummarizerNode: DocumentsSummarizerNode;
  GoogleAIModelFactory: GoogleAIModelFactory;
  GoogleOAuth2ClientFactory: GoogleOAuth2ClientFactory;
  LoadDocumentsUseCaseFactory: LoadDocumentsUseCaseFactory;
  MeetingReportAnnotation: typeof MeetingReportAnnotation;
  SummarizerGoogleAIModel: ChatGoogleGenerativeAI;
}

export type DependencyToken = keyof AppDependencies;
