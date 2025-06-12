import { MeetingReportStateAnnotation } from "@/infrastructure/framework/langchain/meeting-report-annotation";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export class DocumentSynthesizerNode {
  private chain;

  constructor(private model: ChatGoogleGenerativeAI) {
    const prompt = ChatPromptTemplate.fromMessages([
      HumanMessagePromptTemplate.fromTemplate(`
      You are an expert AI assistant. Your task is to synthesize multiple documents into a single, coherent text that represents a complete record of a meeting.

      Instructions:
      1.  **Merge and Organize:** Combine information logically. Merge participant lists, agenda items, and discussion points from all provided documents.
      2.  **Establish Chronology:** Arrange discussion points in a logical or chronological order.
      3.  **Discard Irrelevant Information:** If a document or section is clearly unrelated to the main meeting topic (e.g., a different project's status, personal notes), exclude it from the final text.
      4.  **Do Not Summarize:** Your output should be a detailed, combined text, NOT a short summary. The goal is to create the perfect input for a later extraction step. Retain as much relevant detail as possible.

      Here are the documents to synthesize:
      ---
      {documents}
      ---

      Produce the synthesized, unified text below.`),
    ]);

    this.chain = prompt.pipe(this.model).pipe(new StringOutputParser());
  }

  public async synthesize(
    state: MeetingReportStateAnnotation
  ): Promise<Partial<MeetingReportStateAnnotation>> {
    console.log("Node: Synthesizing documents...");

    if (!state.documents || state.documents.length === 0) {
      console.warn("Synthesizer node: No documents to synthesize.");
      return { failureReason: "No documents were available for synthesis." };
    }

    const documentsText = state.documents
      .map(
        (doc, index) =>
          `--- Document ${index + 1}: ${doc.name} ---\n${doc.content}`
      )
      .join("\n\n");

    const synthesizedText = await this.chain.invoke({
      documents: documentsText,
    });

    console.log("Node: Documents synthesized successfully.");
    console.log("Synthesized Text:", synthesizedText);
    return { synthesizedText };
  }
}
