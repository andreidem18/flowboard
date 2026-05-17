import { prisma } from "@/lib/prisma";
import {
  CreateTaskBody,
  GetTasksQuery,
  TasksCount,
  UpdateTaskBody,
} from "@repo/shared";
import { NotFoundError } from "elysia";

export const taskRepository = {
  getAll(filters: GetTasksQuery) {
    return prisma.task.findMany({
      where: {
        ...(filters.userId ? { userId: filters.userId } : {}),
        ...(filters.projectId ? { projectId: filters.projectId } : {}),
        ...(filters.status ? { status: filters.status } : {}),
      },
      include: {
        project: {
          select: { name: true, color: true },
        },
        user: { select: { name: true } },
      },
      orderBy: { position: "asc" },
    });
  },

  async getOne(id: number) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: { select: { name: true, color: true } },
        user: { select: { name: true } },
      },
    });
    if (!task) throw new NotFoundError("Task not found");
    return task;
  },

  async create(body: CreateTaskBody) {
    return prisma.$transaction(async (tx) => {
      await tx.task.updateMany({
        where: { projectId: body.projectId, status: body.status },
        data: { position: { increment: 1 } },
      });

      return await tx.task.create({
        data: { ...body, position: 1 },
        include: {
          project: {
            select: { name: true, color: true },
          },
          user: { select: { name: true } },
        },
      });
    });
  },

  async delete(id: number) {
    await prisma.task.delete({ where: { id } });
  },

  update(id: number, body: UpdateTaskBody) {
    return prisma.task.update({
      data: body,
      where: { id },
      include: {
        project: {
          select: { name: true, color: true },
        },
        user: { select: { name: true } },
      },
    });
  },

  async getDashboardTaskCount(): Promise<TasksCount> {
    const [
      completedTasks,
      highTasks,
      inProgressTasks,
      lowTasks,
      mediumTasks,
      newTasks,
      overdueTasks,
      stoppedTasks,
      totalTasks,
    ] = await Promise.all([
      prisma.task.count({ where: { status: "FINISHED" } }),
      prisma.task.count({ where: { priority: "HIGH" } }),
      prisma.task.count({ where: { status: "IN_PROGRESS" } }),
      prisma.task.count({ where: { priority: "LOW" } }),
      prisma.task.count({ where: { priority: "MEDIUM" } }),
      prisma.task.count({ where: { status: "NEW" } }),
      prisma.task.count({
        where: { deadline: { lt: new Date() }, status: { not: "FINISHED" } },
      }),
      prisma.task.count({ where: { status: "STOPPED" } }),
      prisma.task.count(),
    ]);
    return {
      completedTasks,
      highTasks,
      inProgressTasks,
      lowTasks,
      mediumTasks,
      newTasks,
      overdueTasks,
      stoppedTasks,
      totalTasks,
    };
  },

  async getDashboardProjectsWithTasks() {
    return prisma.project.findMany({
      select: {
        id: true,
        name: true,
        color: true,

        tasks: {
          select: {
            status: true,
          },
        },
      },
    });
  },

  async getDashboardUpcomingTasks() {
    const next7Days = new Date();
    const past2Days = new Date();
    next7Days.setDate(next7Days.getDate() + 7);
    past2Days.setDate(past2Days.getDate() - 2);

    return prisma.task.findMany({
      select: {
        id: true,
        name: true,
        deadline: true,
        project: {
          select: { id: true, name: true, color: true },
        },
      },
      where: {
        deadline: {
          gte: past2Days,
          lte: next7Days,
        },
        status: {
          not: "FINISHED",
        },
      },
      orderBy: {
        deadline: "asc",
      },

      take: 5,
    });
  },
};
