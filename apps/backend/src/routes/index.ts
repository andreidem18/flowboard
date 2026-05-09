import Elysia from "elysia";
import { projectRoutes } from "../modules/projects/project.routes";

export const routes = new Elysia().use(projectRoutes);
