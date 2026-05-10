import { z } from "zod";
import { taskStatusSchema, taskPrioritySchema } from "@repo/shared";

export const taskFormSchema = z.object({
  name: z
    .string()
    .min(1, "Task name is required")
    .max(255, "Task name must not exceed 255 characters"),
  description: z
    .string()
    .max(2000, "Description must not exceed 2000 characters")
    .optional()
    .or(z.literal("")),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  deadline: z.string().optional().or(z.literal("")),
  userId: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;
