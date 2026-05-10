import { z } from "zod";

export const projectFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters"),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;
