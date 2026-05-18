import { z } from "zod";
import { simpleProjectSchema } from "./project";

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
  position: z.number().int(),
  deadline: z.string().nullable(),
  finishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  projectId: z.number().int(),
  userId: z.string(),
  project: z.object({
    name: z.string(),
    color: z.string().nullable(),
  }),
  user: z.object({
    name: z.string(),
  }),
});

export const getAllTasksSchema = z.array(taskSchema);

export const createTaskBodySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  priority: taskPrioritySchema.optional(),
  status: taskStatusSchema.optional(),
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
  status: taskStatusSchema.optional(),
});

export const reorderTaskBodySchema = z.object({
  newPosition: z.number().int(),
  newStatus: taskStatusSchema,
});

export const reorderTaskResponseSchema = z.object({
  newPosition: z.number().int(),
  newStatus: taskStatusSchema,
});

// Dashboard

export const tasksCountSchema = z.object({
  totalTasks: z.number(),
  newTasks: z.number(),
  inProgressTasks: z.number(),
  stoppedTasks: z.number(),
  completedTasks: z.number(),
  overdueTasks: z.number(),
  lowTasks: z.number(),
  mediumTasks: z.number(),
  highTasks: z.number(),
});

export const tasksByProjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  color: z.string().nullable(),
  totalTasks: z.number(),
  finishedTasks: z.number(),
  inProgressTasks: z.number(),
  notFinishedTasks: z.number(),
});

export const upcomingTasksSchema = z.object({
  id: z.number(),
  name: z.string(),
  daysLeft: z.number().nullable(),
  deadline: z.string().optional(),
  project: simpleProjectSchema,
});

export const dashboardSchema = z.object({
  taskCount: tasksCountSchema,
  tasksByProject: z.array(tasksByProjectSchema),
  upcomingTasks: z.array(upcomingTasksSchema),
});

export type Task = z.infer<typeof taskSchema>;
export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type TaskPriority = z.infer<typeof taskPrioritySchema>;
export type GetAllTasks = z.infer<typeof getAllTasksSchema>;
export type CreateTaskBody = z.infer<typeof createTaskBodySchema>;
export type UpdateTaskBody = z.infer<typeof updateTaskBodySchema>;
export type GetTasksQuery = z.infer<typeof getTasksQuerySchema>;
export type ReorderTaskBody = z.infer<typeof reorderTaskBodySchema>;
export type ReorderTaskResponse = z.infer<typeof reorderTaskResponseSchema>;

// Dashboard
export type TasksCount = z.infer<typeof tasksCountSchema>;
export type TasksByProject = z.infer<typeof tasksByProjectSchema>;
export type UpcomingTasks = z.infer<typeof upcomingTasksSchema>;
export type Dashboard = z.infer<typeof dashboardSchema>;
