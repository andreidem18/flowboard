import { z } from "zod";

export const taskStatusSchema = z.enum([
  "todo",
  "in_progress",
  "done",
]);

export const taskPrioritySchema = z.enum([
  "low",
  "medium",
  "high",
]);

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  createdAt: z.date(),
});

export type Task = z.infer<typeof taskSchema>;
export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type TaskPriority = z.infer<typeof taskPrioritySchema>;
