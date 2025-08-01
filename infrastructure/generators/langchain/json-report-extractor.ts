import { jsonReportSchema } from "@/infrastructure/generators/langchain/json-report-schema";
import { StateAnnotation } from "@/infrastructure/generators/langchain/langchain-json-generator";
import { LangchainNode } from "@/infrastructure/generators/langchain/types";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { RunnableConfig } from "@langchain/core/runnables";
import { ZodError } from "zod";

export class JsonReportExtractor implements LangchainNode<StateAnnotation> {
  private chain;

  constructor(private model: BaseChatModel) {
    const prompt = ChatPromptTemplate.fromMessages([
      HumanMessagePromptTemplate.fromTemplate(
        `
          You are a hyper-efficient Executive Assistant AI, specializing in distilling meeting conversations into structured, actionable reports.

          **CRITICAL INSTRUCTIONS:**
          1.  **Adhere Strictly to the Schema:** Your output MUST be a valid JSON object that conforms to the provided structure.
          2.  **Do Not Invent Information:** Extract content only from the provided text.
          3.  **Be Concise:** Summarize points and decisions clearly.
          4.  **Empty Sections:** If no information is found for a field (e.g., no action items), return an empty array [].

          **EXAMPLE:**
          ---
          **Input Text Example:**
          "Alright team, let's kick off the Q3 project sync. On the agenda is the UI redesign. Sarah from Design, what's the status? Sarah: The mockups are done. We need feedback by Friday. Mark: Looks good. I approve. So, the decision is Sarah will share the mockups today."
          ---
          **Output JSON Example:**
          {{
            "title": "Q3 Project Sync",
            "summary": "The team met to sync on the Q3 project, focusing on the UI redesign. The mockups were presented by Sarah and approved, with an action item to share them for feedback.",
            "participants": [{{ "name": "Sarah", "role": "Design" }}, {{ "name": "Mark" }}],
            "agenda": ["UI redesign status"],
            "discussion": [
              {{ "speaker": "Sarah", "text": "UI mockups are complete and require feedback by Friday." }},
              {{ "speaker": "Mark", "text": "Approved the mockups." }}
            ],
            "actionItems": [{{ "description": "Share the UI mockups for feedback", "owner": "Sarah", "dueDate": "today" }}]
          }}
          ---

          **Now, analyze the following meeting notes and generate the structured report.**

          **Synthesized Meeting Notes to Analyze:**
          ---
          {synthesizedText}
          ---
        `
      ),
    ]);

    this.chain = prompt.pipe(this.model.withStructuredOutput(jsonReportSchema));
  }

  public async run(
    state: StateAnnotation,
    config?: RunnableConfig
  ): Promise<Partial<StateAnnotation>> {
    console.log("Node: Extracting structured report...");

    if (!state.synthesizedText) {
      const reason = "Cannot extract report: synthesized text is missing.";
      console.error(`ExtractReportNode: ${reason}`);
      return { failureReason: reason };
    }

    try {
      const jsonReport = await this.chain.invoke(
        { synthesizedText: state.synthesizedText },
        config
      );

      console.log("Node: Structured report extracted successfully.");
      return { jsonReport };
    } catch (error) {
      let reason = "An unexpected error occurred during report extraction.";
      if (error instanceof ZodError) {
        const validationErrors = error.errors
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join("; ");
        reason = `The AI's output failed schema validation. Details: ${validationErrors}`;
        console.error("ExtractReportNode: Zod validation failed.", {
          validationErrors,
        });
      } else {
        reason =
          "The AI failed to generate a valid structured report due to a system error.";
        console.error(
          "ExtractReportNode: Failed to extract structured report.",
          error
        );
      }
      return { failureReason: reason };
    }
  }
}
