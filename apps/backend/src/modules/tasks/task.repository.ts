import { prisma } from "@/lib/prisma";
import { CreateTaskBody, GetTasksQuery, UpdateTaskBody } from "@repo/shared";
import { NotFoundError } from "elysia";

export const taskRepository = {
  getAll(filters: GetTasksQuery) {
    return prisma.task.findMany({
      where: {
        ...(filters.userId ? { userId: filters.userId } : {}),
        ...(filters.projectId ? { projectId: filters.projectId } : {}),
      },
    });
  },

  async getOne(id: number) {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundError("Task not found");
    return task;
  },

  create(body: CreateTaskBody) {
    return prisma.task.create({ data: body });
  },

  async delete(id: number) {
    await prisma.task.delete({ where: { id } });
  },

  update(id: number, body: UpdateTaskBody) {
    return prisma.task.update({ data: body, where: { id } });
  },
};
