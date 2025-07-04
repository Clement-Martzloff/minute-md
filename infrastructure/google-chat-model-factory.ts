import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

interface ChatModelCreationOptions {
  model?: string;
  temperature?: number;
}

export interface ChatModelFactory {
  create(options?: ChatModelCreationOptions): BaseChatModel;
}

export class GoogleChatModelFactory implements ChatModelFactory {
  private readonly defaultConfig: {
    apiKey: string;
    model: string;
    temperature: number;
  };

  constructor(config: {
    apiKey: string;
    defaultModel?: string;
    defaultTemperature?: number;
  }) {
    if (!config.apiKey) {
      throw new Error(
        "GoogleChatModelFactory requires an API key in its constructor."
      );
    }

    this.defaultConfig = {
      apiKey: config.apiKey,
      model: config.defaultModel ?? "gemini-1.5-flash-latest",
      temperature: config.defaultTemperature ?? 0.5,
    };
  }

  public create(options = {}) {
    const finalConfig = { ...this.defaultConfig, ...options };

    return new ChatGoogleGenerativeAI(finalConfig);
  }
}
