import { MeetingReportStateAnnotation } from "@/infrastructure/framework/langchain/meeting-report-annotation";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export class DocumentsSummarizerNode {
  private chain;

  constructor(private model: ChatGoogleGenerativeAI) {
    const prompt = ChatPromptTemplate.fromMessages([
      HumanMessagePromptTemplate.fromTemplate(
        `Summarize the following documents:\n\n{documents}`
      ),
    ]);

    this.chain = prompt.pipe(this.model).pipe(new StringOutputParser());
  }

  public async summarize(
    state: MeetingReportStateAnnotation
  ): Promise<Partial<MeetingReportStateAnnotation>> {
    console.log("Summarizing documents...");

    const documentsText = state.documents
      .map(
        (doc, index) => `Document ${index + 1} - ${doc.name}:\n${doc.content}`
      )
      .join("\n\n");

    const summary = await this.chain.invoke({ documents: documentsText });
    console.log("Summary generated:", summary);
    return { summary };
  }
}
