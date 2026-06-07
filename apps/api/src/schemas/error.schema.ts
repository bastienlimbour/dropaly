import { z } from "zod";

export const errorResponseSchema = z.object({
  code: z.string(),
  error: z.string(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
