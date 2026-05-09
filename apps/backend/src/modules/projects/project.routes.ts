import Elysia from "elysia";
import { projectService } from "./project.services";
import { createProjectBodySchema, updateProjectBodySchema } from "@repo/shared";
import { numericIdParamSchema } from "@/common/schemas";

export const projectRoutes = new Elysia({ prefix: "/projects" });

projectRoutes.get("/", () => {
  return projectService.getAll();
});

projectRoutes.post(
  "/",
  ({ body }) => {
    return projectService.create(body);
  },
  {
    body: createProjectBodySchema,
  },
);

projectRoutes.delete(
  "/:id",
  async ({ params: { id } }) => {
    await projectService.delete(id);
    return { ok: true };
  },
  {
    params: numericIdParamSchema,
  },
);

projectRoutes.patch(
  "/:id",
  async ({ params: { id }, body }) => {
    return projectService.update(id, body);
  },
  {
    params: numericIdParamSchema,
    body: updateProjectBodySchema,
  },
);
