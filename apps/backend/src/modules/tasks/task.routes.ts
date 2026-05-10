import Elysia from "elysia";
import {
  createTaskBodySchema,
  dashboardSchema,
  deleteResSchema,
  getAllTasksSchema,
  getTasksQuerySchema,
  taskSchema,
  updateTaskBodySchema,
} from "@repo/shared";
import { numericIdParamSchema } from "@/common/schemas";
import { Tags } from "@/constants";
import { betterAuth } from "@/middlewares";
import { taskService } from "./task.service";

export const taskRoutes = new Elysia({
  prefix: "/tasks",
  tags: [Tags.task],
}).use(betterAuth);

taskRoutes.get(
  "/",
  async ({ query }) => {
    return taskService.getAll(query);
  },
  {
    query: getTasksQuerySchema,
    response: { 200: getAllTasksSchema },
    auth: true,
  },
);

taskRoutes.get(
  "/:id",
  async ({ params: { id }, status }) => {
    return status(200, await taskService.getOne(id));
  },
  {
    params: numericIdParamSchema,
    response: { 200: taskSchema },
    auth: true,
  },
);

taskRoutes.post(
  "/",
  async ({ body, status }) => {
    return status(201, await taskService.create(body));
  },
  {
    body: createTaskBodySchema,
    response: { 201: taskSchema },
    auth: true,
  },
);

taskRoutes.patch(
  "/:id",
  async ({ params: { id }, body }) => {
    return await taskService.update(id, body);
  },
  {
    params: numericIdParamSchema,
    body: updateTaskBodySchema,
    response: { 200: taskSchema },
    auth: true,
  },
);

taskRoutes.delete(
  "/:id",
  async ({ params: { id } }) => {
    await taskService.delete(id);
    return { ok: true };
  },
  {
    params: numericIdParamSchema,
    response: { 200: deleteResSchema },
    auth: true,
  },
);

taskRoutes.get(
  "/dashboard-data",
  async () => {
    return taskService.getDashboardData();
  },
  {
    response: { 200: dashboardSchema },
    auth: true,
  },
);
