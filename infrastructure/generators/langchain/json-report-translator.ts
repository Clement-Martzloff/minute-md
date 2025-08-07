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

export class JsonReportTranslator implements LangchainNode<StateAnnotation> {
  private chain;

  constructor(private model: BaseChatModel) {
    const prompt = ChatPromptTemplate.fromMessages([
      HumanMessagePromptTemplate.fromTemplate(
        `
          You are an expert multilingual translator AI. Your task is to translate the textual content of a JSON object into a specified language while preserving the JSON structure perfectly.

          **CRITICAL INSTRUCTIONS:**
          1.  **Translate ONLY the String Values:** You must translate the user-facing content (like titles, summaries, names, descriptions).
          2.  **DO NOT Translate JSON Keys:** The keys (e.g., "title", "summary", "actionItems") must remain in English and unchanged.
          3.  **Preserve Structure:** Your output MUST be a valid JSON object with the exact same structure and schema as the input.
          4.  **Target Language:** Translate the content into the language specified: **{language}**.
          5.  **No Extra Commentary:** Your final output should be ONLY the translated JSON object. Do not add any introduction, explanation, or markdown formatting like \`\`\`json.

          ---
          **JSON Object to Translate:**
          {inputJson}
          ---
        `,
      ),
    ]);

    this.chain = prompt.pipe(this.model.withStructuredOutput(jsonReportSchema));
  }

  public async run(
    state: StateAnnotation,
    config?: RunnableConfig,
  ): Promise<Partial<StateAnnotation>> {
    if (!state.jsonReport) {
      const reason =
        "Cannot translate report: 'jsonReport' is missing from the state.";
      console.error(`JsonReportTranslator: ${reason}`);
      return { failureReason: reason };
    }

    if (!state.targetLanguage) {
      const reason =
        "Cannot translate report: 'targetLanguage' is missing from the state.";
      console.error(`JsonReportTranslator: ${reason}`);
      return { failureReason: reason };
    }

    try {
      const inputJson = JSON.stringify(state.jsonReport, null, 2);

      const translatedJsonReport = await this.chain.invoke(
        {
          inputJson: inputJson,
          language: state.targetLanguage,
        },
        config,
      );

      return { translatedJsonReport };
    } catch (error) {
      let reason = "An unexpected error occurred during report translation.";
      if (error instanceof ZodError) {
        const validationErrors = error.errors
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join("; ");
        reason = `The AI's translated output failed schema validation. Details: ${validationErrors}`;
        console.error("JsonReportTranslator: Zod validation failed.", {
          validationErrors,
        });
      } else {
        reason =
          "The AI failed to generate a valid translated report due to a system error.";
        console.error(
          "JsonReportTranslator: Failed to translate structured report.",
          error,
        );
      }
      return { failureReason: reason };
    }
  }
}
