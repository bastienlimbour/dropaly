import { gateway } from "@ai-sdk/gateway";
import { wrapLanguageModel } from "ai";

export async function createAiTextModel() {
  const model = gateway.languageModel("mistral/ministral-3b");

  if (process.env["NODE_ENV"] !== "development") {
    return model;
  }

  const { devToolsMiddleware } = await import("@ai-sdk/devtools");

  return wrapLanguageModel({ model, middleware: devToolsMiddleware() });
}
