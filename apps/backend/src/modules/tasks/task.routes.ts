import Elysia from "elysia";
import {
  createTaskBodySchema,
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
import type {
  Task as PrismaTask,
  Project as PrismaProject,
  User as PrismaUser,
} from "../../../generated/prisma/client";

type TaskWithProject = PrismaTask & {
  project: Pick<PrismaProject, "name" | "color">;
  user: Pick<PrismaUser, "name">;
};

const mapTask = (task: TaskWithProject) => ({
  ...task,
  createdAt: task.createdAt.toISOString(),
  updatedAt: task.updatedAt.toISOString(),
  deadline: task.deadline?.toISOString() ?? null,
  finishedAt: task.finishedAt?.toISOString() ?? null,
});

export const taskRoutes = new Elysia({
  prefix: "/tasks",
  tags: [Tags.task],
}).use(betterAuth);

taskRoutes.get(
  "/",
  async ({ query }) => {
    const tasks = await taskService.getAll(query);
    return tasks.map(mapTask);
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
    const task = await taskService.getOne(id);
    return status(200, mapTask(task));
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
    const task = await taskService.create(body);
    return status(201, mapTask(task));
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
    const task = await taskService.update(id, body);
    return mapTask(task);
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
