import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Please enter a valid email").min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .min(1, "Password is required"),
  rememberMe: z.boolean(),
});

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .min(1, "Name is required"),
  email: z.email("Please enter a valid email").min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
