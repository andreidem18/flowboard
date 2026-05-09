import Elysia, { t } from "elysia";
import {
  createTaskBodySchema,
  deleteResSchema,
  getAllTasksSchema,
  taskSchema,
  updateTaskBodySchema,
} from "@repo/shared";
import { numericIdParamSchema } from "@/common/schemas";
import { Tags } from "@/constants";
import { betterAuth } from "@/middlewares";

const mockTask = {
  id: 1,
  name: "Mock task",
  description: null,
  status: "NEW" as const,
  priority: "MEDIUM" as const,
  deadline: null,
  finishedAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  projectId: 1,
  userId: "mock-user-id",
};

export const taskRoutes = new Elysia({
  prefix: "/tasks",
  tags: [Tags.task],
}).use(betterAuth);

taskRoutes.get("/", () => [mockTask], {
  query: t.Object({ projectId: t.Optional(t.Numeric()) }),
  response: { 200: getAllTasksSchema },
  auth: true,
});

taskRoutes.get("/:id", () => mockTask, {
  params: numericIdParamSchema,
  response: { 200: taskSchema },
  auth: true,
});

taskRoutes.post("/", ({ status }) => status(201, mockTask), {
  body: createTaskBodySchema,
  response: { 201: taskSchema },
  auth: true,
});

taskRoutes.patch("/:id", () => mockTask, {
  params: numericIdParamSchema,
  body: updateTaskBodySchema,
  response: { 200: taskSchema },
  auth: true,
});

taskRoutes.delete("/:id", () => ({ ok: true }), {
  params: numericIdParamSchema,
  response: { 200: deleteResSchema },
  auth: true,
});
