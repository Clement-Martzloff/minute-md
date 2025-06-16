import { Document } from "@/core/domain/document";
import { DocumentRepository } from "@/core/ports/document-repository";
import { Logger } from "@/core/ports/logger";
import {
  MeetingReportProcessingResult,
  MeetingReportProcessor,
} from "@/core/ports/meeting-report-processor";
import { TokenCounter } from "@/core/ports/token-counter";
import { LoadDocumentsUseCase } from "@/core/usecases/load-documents";
import { UseCase } from "@/core/usecases/types";
import { GoogleDocumentRepositoryContext } from "@/infrastructure/adapters/google-drive-document-repository-factory";
import { MeetingReportStateAnnotation } from "@/infrastructure/adapters/langchain-meeting-report-processor";
import { OAuth2ClientFactory } from "@/infrastructure/framework/google/google-oauth2-client-factory";
import { LangchainChatModelFactory } from "@/infrastructure/framework/langchain/google-chat-model-factory";
import { LangchainNode } from "@/infrastructure/framework/langchain/types";
import { LoadDocumentsUsecaseContext } from "@/infrastructure/framework/nextjs/load-documents-usecase-factory";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

export interface RuntimeDependencyFactory<Context, Output> {
  create(context: Context): Output;
}

export interface AppDependencies {
  ChatModelFactory: LangchainChatModelFactory;
  DocumentRepositoryFactory: RuntimeDependencyFactory<
    GoogleDocumentRepositoryContext,
    DocumentRepository
  >;
  OAuth2ClientFactory: OAuth2ClientFactory;
  GenerateMeetingReportUseCase: UseCase<
    Document[],
    Promise<MeetingReportProcessingResult>
  >;
  LoadDocumentsUseCaseFactory: RuntimeDependencyFactory<
    LoadDocumentsUsecaseContext,
    LoadDocumentsUseCase
  >;
  Logger: Logger;
  MeetingDocumentsRelevanceFilterNode: LangchainNode<MeetingReportStateAnnotation>;
  MeetingDocumentsRelevanceFilterChatModel: BaseChatModel;
  MeetingDocumentsSynthesizerChatModel: BaseChatModel;
  MeetingDocumentsSynthesizerNode: LangchainNode<MeetingReportStateAnnotation>;
  MeetingReportExtractorChatModel: BaseChatModel;
  MeetingReportExtractorNode: LangchainNode<MeetingReportStateAnnotation>;
  MeetingReportProcessor: MeetingReportProcessor;
  TokenCounter: TokenCounter;
}

export type DependencyToken = keyof AppDependencies;
