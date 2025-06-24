import { MeetingReportStateAnnotation } from "@/infrastructure/adapters/langchain-meeting-report-processor";
import { LangchainNode } from "@/infrastructure/framework/langchain/types";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import type { Root } from "mdast";

export class MeetingReportMdastFormatterNode
  implements LangchainNode<MeetingReportStateAnnotation>
{
  private chain;

  constructor(private model: BaseChatModel) {
    const prompt = ChatPromptTemplate.fromMessages([
      HumanMessagePromptTemplate.fromTemplate(
        `
          You are an expert Markdown formatting AI. Your sole purpose is to convert a structured JSON object representing a meeting report into a valid MDAST (Markdown Abstract Syntax Tree) JSON object.

          **CRITICAL INSTRUCTIONS:**
          1.  **Input:** You will receive a JSON object with keys like "title", "summary", "participants", etc.
          2.  **Output:** You MUST respond with ONLY a single, valid, parsable JSON object that represents the complete MDAST tree. The root object must have a "type" of "root".
          3.  **Formatting Rules:**
              - The report "title" should be a top-level heading (depth: 1).
              - "Summary", "Participants", and "Action Items" should be second-level headings (depth: 2).
              - "Action Items" should be rendered as a task list (list items with "checked: false").
          4.  **No Extra Text:** Do not add any explanations, apologies, or text outside of the final JSON object.

          **Meeting Report JSON to Convert:**
          \`\`\`json
          {meetingReportJson}
          \`\`\`
        `
      ),
    ]);

    this.chain = prompt
      .pipe(this.model.withConfig({ tags: ["final_node"] }))
      .pipe(new JsonOutputParser());
  }

  public async run(
    state: MeetingReportStateAnnotation
  ): Promise<Partial<MeetingReportStateAnnotation>> {
    console.log("Node: Formatting report JSON to MDAST via LLM...");

    const meetingReport = state.meetingReportDraft;
    if (!meetingReport) {
      return {
        failureReason:
          "Cannot format to MDAST: meeting report draft is missing.",
      };
    }

    try {
      const mdastResult = await this.chain.invoke({
        meetingReportJson: JSON.stringify(meetingReport, null, 2),
      });

      console.log("Node: MDAST formatting successful.");
      return { mdast: mdastResult as Root };
    } catch (error) {
      console.error(
        "MdastFormatterNode: Failed to generate or parse MDAST.",
        error
      );

      const reason =
        "The AI failed to generate a valid JSON object for the MDAST.";
      return { failureReason: reason };
    }
  }
}
