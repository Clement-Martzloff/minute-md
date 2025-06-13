import { MeetingReportStateAnnotation } from "@/infrastructure/adapters/langchain-meeting-report-processor";
import { LangchainNode } from "@/infrastructure/framework/langchain/types";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";

export class MeetingDocumentsRelevanceCheck
  implements LangchainNode<MeetingReportStateAnnotation>
{
  private chain;

  constructor(private model: BaseChatModel) {
    const prompt = ChatPromptTemplate.fromMessages([
      HumanMessagePromptTemplate.fromTemplate(
        `
          Review the following documents and determine if they contain information relevant to a single meeting, such that a structured meeting report (participants, agenda, discussion points, decisions) could potentially be extracted.

          Consider the document titles and a brief look at their content.
          Ignore documents that seem completely unrelated to a meeting (e.g., project plans, code files, random notes without meeting context).

          Answer ONLY with the word "YES" if relevant, or "NO" if not relevant. Do not include any other text, punctuation, or explanation.

          Documents:
          ---
          {documents}
          ---

          Answer:
        `
      ),
    ]);

    this.chain = prompt
      .pipe(this.model.withConfig({ stop: ["."] }))
      .pipe(new StringOutputParser());
  }

  public async run(
    state: MeetingReportStateAnnotation
  ): Promise<Partial<MeetingReportStateAnnotation>> {
    console.log("Checking documents relevance...");

    if (!state.documents || state.documents.length === 0) {
      console.log("No documents found for relevance check.");
      return { isRelevant: false, failureReason: "No documents provided." };
    }

    const documentsText = state.documents
      .map(
        (doc, index) =>
          `Document ${index + 1}: ${doc.name}\n${doc.content.substring(
            0,
            200
          )}${doc.content.length > 200 ? "..." : ""}`
      )
      .join("\n---\n");

    const relevanceResponse = await this.chain.invoke({
      documents: documentsText,
    });
    const isRelevant = relevanceResponse.trim().toUpperCase() === "YES";

    console.log(
      "Relevance check result:",
      relevanceResponse.trim(),
      "->",
      isRelevant ? "Relevant" : "Not Relevant"
    );

    return {
      isRelevant,
      failureReason: isRelevant
        ? undefined
        : "Documents deemed irrelevant for a meeting report.",
    };
  }
}
