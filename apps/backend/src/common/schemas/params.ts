import z from "zod";

export const numericIdParamSchema = z.object({
  id: z.coerce.number().int(),
});
