import { Tags } from "@/constants";
import { betterAuth } from "@/middlewares";
import { getAllUsersQuery, getAllUsersSchema } from "@repo/shared";
import Elysia from "elysia";
import { userService } from "./user.service";

export const userRoutes = new Elysia({
  prefix: "/user",
  tags: [Tags.user],
}).use(betterAuth);

userRoutes.get(
  "/",
  async ({ query, status }) => {
    const users = await userService.getAllUsers(query);
    return status(200, users);
  },
  {
    auth: true,
    response: { 200: getAllUsersSchema },
    query: getAllUsersQuery,
  },
);
