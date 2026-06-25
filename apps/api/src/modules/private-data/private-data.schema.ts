import { z } from "zod";

export const privateDataSchema = z.object({
  message: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
  }),
});

z.globalRegistry.add(privateDataSchema, { id: "PrivateData" });
