import z from "zod";
import { userSchema } from "./user";

export const signupBodySchema = z.object({
  name: z.string(),
  email: z.string(),
  passowrd: z.string(),
});

export const signupResSchema = z.object({
  user: userSchema,
});

export const loginBodySchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const loginResSchema = z.object({
  user: userSchema,
  redirect: z.boolean(),
});

export type SignupBody = z.infer<typeof signupBodySchema>;
export type SignupRes = z.infer<typeof signupResSchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
export type LoginRes = z.infer<typeof loginResSchema>;
