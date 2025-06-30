import { ContentExtractor } from "@/core/ports/content-extractor";
import { JsonGenerator } from "@/core/ports/json-generator";
import { Logger } from "@/core/ports/logger";
import { MarkdownGenerator } from "@/core/ports/markdown-generator";
import { TokenCounter } from "@/core/ports/token-counter";
import { GenerateReportUseCase } from "@/core/usecases/generate-report";
import { LoadSelectedFilesUseCase } from "@/core/usecases/load-selected-files";
import { ChatModelFactory } from "@/infrastructure/factories/google-chat-model-factory";
import { StateAnnotation } from "@/infrastructure/generators/langchain/langchain-json-generator";
import { LangchainNode } from "@/infrastructure/generators/langchain/types";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

export interface ReportMeetingDependencies {
  ChatModelFactory: ChatModelFactory;
  ContentExtractor: ContentExtractor;
  DocumentsRelevanceFilter: LangchainNode<StateAnnotation>;
  DocumentsRelevanceFilterChatModel: BaseChatModel;
  DocumentsSynthesizer: LangchainNode<StateAnnotation>;
  DocumentsSynthesizerChatModel: BaseChatModel;
  GenerateReportUseCase: GenerateReportUseCase;
  JsonGenerator: JsonGenerator;
  JsonReportExtractor: LangchainNode<StateAnnotation>;
  JsonReportExtractorChatModel: BaseChatModel;
  LoadSelectedFiles: LoadSelectedFilesUseCase;
  Logger: Logger;
  MarkdownGenerator: MarkdownGenerator;
  TokenCounter: TokenCounter;
}

export type DependencyToken = keyof ReportMeetingDependencies;
