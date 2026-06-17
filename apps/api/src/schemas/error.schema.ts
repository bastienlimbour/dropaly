import { z } from "zod";

const validationIssueSchema = z.object({
  instancePath: z.string(),
  message: z.string().optional(),
  keyword: z.string().optional(),
  schemaPath: z.string().optional(),
  params: z.record(z.string(), z.any()).optional(),
});

export const errorResponseSchema = z.object({
  statusCode: z.number().int(),
  code: z.string(),
  error: z.string(),
  message: z.string(),
  validation: validationIssueSchema.array().optional(),
});

export type ValidationIssue = z.infer<typeof validationIssueSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
