import z from "zod";

export const createProjectBodySchema = z.object({
  name: z.string(),
});

export const updateProjectBodySchema = createProjectBodySchema.partial();

export type CreateProjectBody = z.infer<typeof createProjectBodySchema>;
export type UpdateProjectBody = z.infer<typeof updateProjectBodySchema>;
