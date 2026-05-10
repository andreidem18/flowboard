import { User as PrismaUser } from "generated/prisma/client";

export const serializeUser = (user: PrismaUser) => ({
  ...user,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});
