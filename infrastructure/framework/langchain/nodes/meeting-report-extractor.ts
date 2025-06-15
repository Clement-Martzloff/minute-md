import { MeetingReportStateAnnotation } from "@/infrastructure/adapters/langchain-meeting-report-processor";
import { LangchainNode } from "@/infrastructure/framework/langchain/types";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { RunnableConfig } from "@langchain/core/runnables";
import { z } from "zod";

const meetingReportSchema = z
  .object({
    title: z
      .string()
      .optional()
      .describe("The main title or subject of the meeting. Should be concise."),
    participants: z
      .array(z.string())
      .describe(
        "A list of all unique participant names who attended the meeting."
      ),
    agenda: z
      .array(z.string())
      .describe(
        "The list of topics or items that were planned for discussion."
      ),
    discussion: z
      .array(
        z.object({
          speaker: z
            .string()
            .describe(
              "The name of the person speaking or who raised the point."
            ),
          text: z
            .string()
            .describe(
              "A summary of the key point, comment, or question raised by the speaker."
            ),
        })
      )
      .describe(
        "A structured summary of the key points discussed during the conversation."
      ),
    decisions: z
      .array(z.string())
      .describe(
        "A list of all clear decisions, action items, or agreed-upon next steps from the meeting."
      ),
  })
  .describe(
    "The final, structured report summarizing the meeting's key information."
  );

type InferredMeetingReport = z.infer<typeof meetingReportSchema>;

export class MeetingReportExtractor
  implements LangchainNode<MeetingReportStateAnnotation>
{
  private chain;

  constructor(private model: BaseChatModel) {
    const prompt = ChatPromptTemplate.fromMessages([
      HumanMessagePromptTemplate.fromTemplate(
        `
          You are a specialist AI for extracting structured data from text.
          Analyze the following meeting notes and provide a structured summary based on the requested format.

          **Instructions for Extraction:**
          - **title**: Extract the main title or subject of the meeting. If none is found, return null.
          - **participants**: List all unique participant names mentioned.
          - **agenda**: List the distinct agenda items or topics for discussion.
          - **discussion**: For each key point in the conversation, identify who said it and what they said. If the speaker is not explicitly mentioned, you can use "Unidentified Speaker".
          - **decisions**: List all clear decisions, action items, conclusions, or agreed-upon next steps.

          **Synthesized Meeting Notes to Analyze:**
          ---
          {synthesizedText}
          ---

          Your response MUST be a valid structured object that adheres to the format provided by the system.
        `
      ),
    ]);

    this.chain = prompt.pipe(
      this.model.withStructuredOutput(meetingReportSchema)
    );
  }

  public async run(
    state: MeetingReportStateAnnotation,
    config?: RunnableConfig
  ): Promise<Partial<MeetingReportStateAnnotation>> {
    console.log("Node: Extracting structured report...");

    if (!state.synthesizedText) {
      const reason =
        "Cannot extract report because document synthesis step did not provide text.";
      console.error(`ExtractReportNode: ${reason}`);
      return { failureReason: reason };
    }

    try {
      const reportDraft = (await this.chain.invoke(
        {
          synthesizedText: state.synthesizedText,
        },
        config
      )) as InferredMeetingReport;

      console.log("Node: Structured report extracted successfully.");
      return { meetingReportDraft: reportDraft };
    } catch (error) {
      const reason =
        "The AI failed to generate a valid structured report from the text.";
      console.error(
        "ExtractReportNode: Failed to extract or parse structured report.",
        error
      );
      return { failureReason: reason };
    }
  }
}
