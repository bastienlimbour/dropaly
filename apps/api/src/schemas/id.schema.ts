import z from "zod";

export const idSchema = z.uuid();

export const idParamsSchema = z.object({
  id: idSchema,
});

export type Id = z.infer<typeof idSchema>;
export type IdParams = z.infer<typeof idParamsSchema>;

// z.globalRegistry.add(idSchema, { id: "Id" });
// z.globalRegistry.add(idParamsSchema, { id: "IdParams" });
