import { z } from "zod";

export const booleanEnv = z
  .enum(["true", "false"])
  .default("false")
  .transform((value) => value === "true");

export const commaSeparatedListEnv = z
  .string()
  .min(1)
  .transform((value) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  )
  .pipe(z.array(z.string().min(1)).min(1));
