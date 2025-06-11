import { Logger } from "@/core/ports/logger";

export class ConsoleLogger implements Logger {
  public info(message: string, meta?: Record<string, unknown>): void {
    console.log(message, meta ?? "");
  }
  public warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(message, meta ?? "");
  }
  public error(message: string, meta?: Record<string, unknown>): void {
    console.error(message, meta ?? "");
  }
}
