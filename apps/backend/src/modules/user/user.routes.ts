import { Tags } from "@/constants";
import { betterAuth } from "@/middlewares";
import { getAllUsersQuery, getAllUsersSchema } from "@repo/shared";
import Elysia from "elysia";
import { userService } from "./user.service";
import { User as PrismaUser } from "generated/prisma/client";

export const userRoutes = new Elysia({
  prefix: "/user",
  tags: [Tags.user],
}).use(betterAuth);

userRoutes.get(
  "/",
  async ({ query, status }) => {
    const users = await userService.getAllUsers(query);
    return status(200, users.map(mapUser));
  },
  {
    auth: true,
    response: { 200: getAllUsersSchema },
    query: getAllUsersQuery,
  },
);

const mapUser = (user: PrismaUser) => ({
  ...user,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});
