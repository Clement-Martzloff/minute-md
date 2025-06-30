import { RunnableConfig } from "@langchain/core/runnables";

export interface LangchainNode<S> {
  run(state: S, config?: RunnableConfig): Promise<Partial<S>>;
}
