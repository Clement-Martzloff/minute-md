import { StateAnnotation } from "@/infrastructure/generators/langchain/langchain-json-generator";
import { LangchainNode } from "@/infrastructure/generators/langchain/types";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { z } from "zod";

const relevanceFilterSchema = z.object({
  relevantDocumentNames: z
    .array(z.string())
    .describe(
      "An array containing the names of only the documents that are relevant to a meeting.",
    ),
});

export class DocumentsRelevanceFilter
  implements LangchainNode<StateAnnotation>
{
  private chain;

  constructor(private model: BaseChatModel) {
    const prompt = ChatPromptTemplate.fromMessages([
      HumanMessagePromptTemplate.fromTemplate(
        `
          You are a document triage AI. Your job is to review a list of documents and identify ONLY those that are relevant for creating a meeting report.

          Relevant documents include: meeting transcripts, minutes, agendas, or notes with clear discussion points.
          Irrelevant documents include: code files, general project plans, invoices, or personal notes unrelated to a meeting.

          Analyze the document names and content snippets below. Return a list of the names of the relevant documents.

          Documents Available:
          ---
          {documents}
          ---

          Example Output:
          If 'minutes.txt' and 'transcript.txt' are relevant but 'project_plan.md' is not, you would return:
          {{ "relevantDocumentNames": ["minutes.txt", "transcript.txt"] }}

          Your response must be a structured object containing only the names of the relevant documents.
        `,
      ),
    ]);

    this.chain = prompt.pipe(
      this.model.withStructuredOutput(relevanceFilterSchema),
    );
  }

  public async run(state: StateAnnotation): Promise<Partial<StateAnnotation>> {
    console.log("Node: Filtering for relevant documents...");

    if (!state.documents || state.documents.length === 0) {
      return { failureReason: "No documents provided to filter." };
    }

    const documentsText = state.documents
      .map(
        (doc) =>
          `Name: ${doc.name}\nContent Preview: ${doc.content!.substring(
            0,
            200,
          )}...`,
      )
      .join("\n---\n");

    const { relevantDocumentNames } = await this.chain.invoke({
      documents: documentsText,
    });

    if (!relevantDocumentNames || relevantDocumentNames.length === 0) {
      console.log("Node: No relevant documents found");
      return {
        documents: [],
        failureReason: "No relevant documents found",
      };
    }

    const originalDocs = state.documents;
    const filteredDocuments = originalDocs.filter((doc) =>
      relevantDocumentNames.includes(doc.name),
    );

    console.log(
      `Node: Filtered down to ${filteredDocuments.length} relevant documents:`,
      relevantDocumentNames,
    );

    return { documents: filteredDocuments };
  }
}
