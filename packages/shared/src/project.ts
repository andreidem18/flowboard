import z from "zod";

export const projectSchema = z.object({
  id: z.int(),
  name: z.string(),
});

export const getAllProjectsSchema = z.array(projectSchema);

export const createProjectBodySchema = z.object({
  name: z.string(),
});

export const updateProjectBodySchema = createProjectBodySchema.partial();

export type Project = z.infer<typeof projectSchema>;
export type GetAllProjects = z.infer<typeof getAllProjectsSchema>;
export type CreateProjectBody = z.infer<typeof createProjectBodySchema>;
export type UpdateProjectBody = z.infer<typeof updateProjectBodySchema>;
