import z from "zod";

export const deleteResSchema = z.object({
  ok: z.boolean(),
});

export type DeleteRes = z.infer<typeof deleteResSchema>;
