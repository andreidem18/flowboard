import { Tags } from "@/constants";
import { betterAuth } from "@/middlewares";
import { getLoggedUserSchema } from "@repo/shared";
import Elysia from "elysia";

export const userRoutes = new Elysia({
  prefix: "/user",
  tags: [Tags.user],
}).use(betterAuth);

userRoutes.get(
  "/me",
  ({ user, session }) => {
    return {
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      session: {
        ...session,
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString(),
        expiresAt: session.expiresAt.toISOString(),
      },
    };
  },
  { auth: true, response: { 200: getLoggedUserSchema } },
);
