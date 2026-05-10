import z from "zod";

export const projectSchema = z.object({
  id: z.int(),
  name: z.string(),
  description: z.string().nullable(),
  color: z.string().nullable(),
});

export const getAllProjectsSchema = z.array(projectSchema);

export const createProjectBodySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  color: z.string().optional(),
});

export const updateProjectBodySchema = createProjectBodySchema.partial();

export const simpleProjectSchema = projectSchema.pick({ id: true, name: true });

export type Project = z.infer<typeof projectSchema>;
export type GetAllProjects = z.infer<typeof getAllProjectsSchema>;
export type CreateProjectBody = z.infer<typeof createProjectBodySchema>;
export type UpdateProjectBody = z.infer<typeof updateProjectBodySchema>;
export type SimpleProject = z.infer<typeof simpleProjectSchema>;
