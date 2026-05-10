import z from "zod";

export const userSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  name: z.string(),
  image: z.string().optional().nullable(),
});

export const sessionSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string(),
  expiresAt: z.string(),
  token: z.string(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
});

export const getLoggedUserSchema = z.object({
  user: userSchema,
  session: sessionSchema,
});

export const getAllUsersSchema = z.array(userSchema);

export const getAllUsersQuery = z.object({
  name: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type GetLoggedUser = z.infer<typeof getLoggedUserSchema>;
export type GetAllUsersQuery = z.infer<typeof getAllUsersQuery>;
export type GetAllUsers = z.infer<typeof getAllUsersSchema>;
