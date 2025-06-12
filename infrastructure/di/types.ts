import { Logger } from "@/core/ports/logger";
import { MeetingReportProcessor } from "@/core/ports/meeting-report-processor";
import { TokenCounter } from "@/core/ports/token-counter";
import { GenerateMeetingReportUseCase } from "@/core/usecases/generate-meeting-report";
import { DocumentRepositoryFactory } from "@/infrastructure/adapters/google-drive-document-repository-factory";
import { DocumentSynthesizerNode } from "@/infrastructure/framework/langchain/documents-synthesizer-node";
import { GoogleAIModelFactory } from "@/infrastructure/framework/langchain/google-ai-model-factory";
import { MeetingReportAnnotation } from "@/infrastructure/framework/langchain/meeting-report-annotation";
import { RelevanceCheckNode } from "@/infrastructure/framework/langchain/relevance-check-node";
import { LoadDocumentsUseCaseFactory } from "@/infrastructure/framework/nextjs/load-documents-factory";
import { GoogleOAuth2ClientFactory } from "@/infrastructure/google/google-oauth2-client-factory";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export interface AppDependencies {
  DocumentRepositoryFactory: DocumentRepositoryFactory;
  GenerateMeetingReportUseCase: GenerateMeetingReportUseCase;
  Logger: Logger;
  MeetingReportProcessor: MeetingReportProcessor;
  TokenCounter: TokenCounter;

  AIModelFactory: GoogleAIModelFactory;
  DocumentSynthesizerNode: DocumentSynthesizerNode;
  GoogleOAuth2ClientFactory: GoogleOAuth2ClientFactory;
  LoadDocumentsUseCaseFactory: LoadDocumentsUseCaseFactory;
  MeetingReportAnnotation: typeof MeetingReportAnnotation;
  RelevanceCheckNode: RelevanceCheckNode;
  RelevanceCheckAIModel: ChatGoogleGenerativeAI;
  SynthesizerAIModel: ChatGoogleGenerativeAI;
}

export type DependencyToken = keyof AppDependencies;
