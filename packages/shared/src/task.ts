import { z } from "zod";

export const taskStatusSchema = z.enum([
  "NEW",
  "IN_PROGRESS",
  "STOPPED",
  "FINISHED",
]);

export const taskPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const taskSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullable(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  deadline: z.string().nullable(),
  finishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  projectId: z.number().int(),
  userId: z.string(),
});

export const getAllTasksSchema = z.array(taskSchema);

export const createTaskBodySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  priority: taskPrioritySchema.optional(),
  deadline: z.iso.datetime().optional(),
  projectId: z.number().int(),
  userId: z.string(),
});

export const updateTaskBodySchema = createTaskBodySchema
  .omit({ projectId: true })
  .extend({
    status: taskStatusSchema.optional(),
    finishedAt: z.iso.datetime().optional(),
  })
  .partial();

export const getTasksQuerySchema = z.object({
  projectId: z.coerce.number().int().optional(),
  userId: z.string().optional(),
});

export type Task = z.infer<typeof taskSchema>;
export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type TaskPriority = z.infer<typeof taskPrioritySchema>;
export type GetAllTasks = z.infer<typeof getAllTasksSchema>;
export type CreateTaskBody = z.infer<typeof createTaskBodySchema>;
export type UpdateTaskBody = z.infer<typeof updateTaskBodySchema>;
export type GetTasksQuery = z.infer<typeof getTasksQuerySchema>;
