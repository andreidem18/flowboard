import { Task, UpcomingTasks } from "@repo/shared";
import type {
  Task as PrismaTask,
  Project as PrismaProject,
  User as PrismaUser,
} from "generated/prisma/client";

interface UpcomingTasksWithDates extends Omit<UpcomingTasks, "deadline"> {
  deadline: Date | null;
}

export const serializeUpcomingTasks = (
  upcomingTasks: UpcomingTasksWithDates[],
) =>
  upcomingTasks.map((t) => ({
    ...t,
    deadline: t.deadline?.toISOString(),
  }));

type TaskWithDate = PrismaTask & {
  project: Pick<PrismaProject, "name" | "color">;
  user: Pick<PrismaUser, "name">;
};

export const serializeTask = (task: TaskWithDate): Task => ({
  ...task,
  createdAt: task.createdAt.toISOString(),
  updatedAt: task.updatedAt.toISOString(),
  deadline: task.deadline?.toISOString() ?? null,
  finishedAt: task.finishedAt?.toISOString() ?? null,
});
