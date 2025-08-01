import { StateAnnotation } from "@/infrastructure/generators/langchain/langchain-json-generator";
import { LangchainNode } from "@/infrastructure/generators/langchain/types";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";

export class DocumentsSynthesizer implements LangchainNode<StateAnnotation> {
  private chain;

  constructor(private model: BaseChatModel) {
    const prompt = ChatPromptTemplate.fromMessages([
      HumanMessagePromptTemplate.fromTemplate(
        `
          You are an expert AI assistant. Your task is to synthesize multiple documents into a single, coherent text that represents a complete record of a meeting.

          **CRITICAL INSTRUCTIONS:**
          1.  **Combine, Don't Create:** Merge information logically. Your goal is to create a single source of truth. **DO NOT invent any information or add connecting phrases** that are not supported by the source text.
          2.  **Preserve Speaker Attribution:** This is vital. If a speaker is identified (e.g., "Sarah:", "Mark says"), you MUST keep their name directly associated with their statement in the final text.
          3.  **Establish Chronology:** Arrange discussion points in the most logical or chronological order possible.
          4.  **This is NOT a Summary:** Retain all specific details, decisions, action items, and data points. The goal is to create a complete, detailed record for a later extraction step.

          Here are the documents to synthesize:
          ---
          {documents}
          ---

          Produce the synthesized, unified text below.
        `
      ),
    ]);

    this.chain = prompt.pipe(this.model).pipe(new StringOutputParser());
  }

  public async run(state: StateAnnotation): Promise<Partial<StateAnnotation>> {
    if (!state.documents || state.documents.length === 0) {
      return { failureReason: "No documents were available for synthesis." };
    }

    const documentsText = state.documents
      .map((doc) => `--- Document: ${doc.name} ---\n${doc.content}`)
      .join("\n\n");

    const synthesizedText = await this.chain.invoke({
      documents: documentsText,
    });

    return { synthesizedText };
  }
}
