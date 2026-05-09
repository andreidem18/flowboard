import Elysia from "elysia";
import { projectService } from "./project.services";
import {
  createProjectBodySchema,
  deleteResSchema,
  getAllProjectsSchema,
  projectSchema,
  updateProjectBodySchema,
} from "@repo/shared";
import { numericIdParamSchema } from "@/common/schemas";
import { Tags } from "@/constants";

export const projectRoutes = new Elysia({
  prefix: "/projects",
  tags: [Tags.project],
});

projectRoutes.get(
  "/",
  () => {
    return projectService.getAll();
  },
  { response: { 200: getAllProjectsSchema } },
);

projectRoutes.post(
  "/",
  async ({ body, status }) => {
    const project = await projectService.create(body);
    return status(201, project);
  },
  {
    body: createProjectBodySchema,
    response: { 201: projectSchema },
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
    response: { 200: deleteResSchema },
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
    response: { 200: projectSchema },
  },
);
