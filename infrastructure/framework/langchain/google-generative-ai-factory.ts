import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export class GoogleGenerativeAIFactory {
  static create(): ChatGoogleGenerativeAI {
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.CHAT_GOOGLE_GENERATIVE_AI_API_KEY!,
      model: "gemini-2.5-flash-preview-05-20",
      temperature: 0.5,
    });

    return model;
  }
}
