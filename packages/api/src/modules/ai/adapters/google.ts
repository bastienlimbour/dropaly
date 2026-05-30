import { google } from "@ai-sdk/google";
import type { LanguageModel } from "ai";
import { wrapLanguageModel } from "ai";

export async function createAiModel(): Promise<LanguageModel> {
  const model = google("gemini-2.5-flash");

  if (process.env["NODE_ENV"] !== "development") {
    return model;
  }

  const { devToolsMiddleware } = await import("@ai-sdk/devtools");

  return wrapLanguageModel({ model, middleware: devToolsMiddleware() });
}
