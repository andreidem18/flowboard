import Elysia from "elysia";
import { projectRoutes } from "../modules/projects/project.routes";
import { betterAuth } from "@/middlewares";
import { userRoutes } from "@/modules/user/user.routes";

export const routes = new Elysia({ prefix: "/api/v1" })
  .use(betterAuth)
  .use(projectRoutes)
  .use(userRoutes);
