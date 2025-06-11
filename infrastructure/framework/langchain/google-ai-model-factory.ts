import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export interface GoogleAIModelFactoryConfig {
  apiKey: string;
  defaultModel?: string;
  defaultTemperature?: number;
}

export interface GoogleAIModelCreationOptions {
  model?: string;
  temperature?: number;
}

export class GoogleAIModelFactory {
  private readonly defaultConfig: {
    apiKey: string;
    model: string;
    temperature: number;
  };

  constructor(config: GoogleAIModelFactoryConfig) {
    if (!config.apiKey) {
      throw new Error(
        "GoogleAIModelFactory requires an API key in its constructor."
      );
    }

    this.defaultConfig = {
      apiKey: config.apiKey,
      model: config.defaultModel ?? "gemini-1.5-flash-latest",
      temperature: config.defaultTemperature ?? 0.5,
    };
  }

  public create(
    options: GoogleAIModelCreationOptions = {}
  ): ChatGoogleGenerativeAI {
    const finalConfig = { ...this.defaultConfig, ...options };

    return new ChatGoogleGenerativeAI(finalConfig);
  }
}
