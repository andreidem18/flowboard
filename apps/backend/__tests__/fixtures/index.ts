import type {
  Task,
  Project,
  CreateTaskBody,
  UpdateTaskBody,
  CreateProjectBody,
  UpdateProjectBody,
} from "@repo/shared";
import {
  DATE_FIXTURES,
  USER_FIXTURES,
  PROJECT_FIXTURES,
  TASK_FIXTURES,
} from "../../prisma/fixtures";

type TaskWithDates = Omit<
  Task,
  "deadline" | "finishedAt" | "createdAt" | "updatedAt"
> & {
  deadline: Date | null;
  finishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

function toTaskWithDates(t: (typeof TASK_FIXTURES)[number]): TaskWithDates {
  return {
    ...t,
    deadline: t.deadline ? new Date(t.deadline) : null,
    finishedAt: t.finishedAt ? new Date(t.finishedAt) : null,
    createdAt: new Date(t.createdAt),
    updatedAt: new Date(t.updatedAt),
  };
}

function toTask(t: (typeof TASK_FIXTURES)[number]): Task {
  return {
    ...t,
    deadline: t.deadline ?? null,
    finishedAt: t.finishedAt ?? null,
  };
}

// Users
export const mockUser = USER_FIXTURES[0];
export const mockUser2 = USER_FIXTURES[1];
export const mockUser3 = USER_FIXTURES[2];
export const mockUsers = [...USER_FIXTURES];

// Projects — with dates (Prisma shape)
export const mockProject: Project = PROJECT_FIXTURES[0];
export const mockProject2: Project = PROJECT_FIXTURES[1];
export const mockProject3: Project = PROJECT_FIXTURES[2];
export const mockProjects: Project[] = [...PROJECT_FIXTURES];

export const mockNewProject: Project = {
  id: 1,
  name: "New Project",
  description: null,
  color: null,
};
export const mockUpdatedProject: Project = {
  id: 1,
  name: "Updated Project",
  description: "Updated description",
  color: "#FF0000",
};

export const mockCreateProjectBody: CreateProjectBody = {
  name: "New Project",
};
export const mockUpdateProjectBody: UpdateProjectBody = {
  name: "Updated Project",
  description: "Updated description",
  color: "#FF0000",
};

// Tasks — WithDates (Prisma shape, for repository tests)
export const mockTaskWithDates: TaskWithDates = toTaskWithDates(
  TASK_FIXTURES[0],
);
export const mockTask2WithDates: TaskWithDates = toTaskWithDates(
  TASK_FIXTURES[1],
);
export const mockTask3WithDates: TaskWithDates = toTaskWithDates(
  TASK_FIXTURES[2],
);
export const mockTasksWithDates: TaskWithDates[] =
  TASK_FIXTURES.map(toTaskWithDates);

export const mockNewTaskWithDates: TaskWithDates = {
  id: 1,
  name: "New Task",
  description: "New task description",
  status: "NEW",
  priority: "MEDIUM",
  deadline: new Date(DATE_FIXTURES.futureDate),
  finishedAt: null,
  createdAt: new Date(DATE_FIXTURES.now),
  updatedAt: new Date(DATE_FIXTURES.now),
  projectId: 1,
  userId: "seed-user-alice",
};

export const mockUpdatedTaskWithDates: TaskWithDates = {
  id: 1,
  name: "Updated Task",
  description: "Updated description",
  status: "IN_PROGRESS",
  priority: "HIGH",
  deadline: new Date(DATE_FIXTURES.endDate),
  finishedAt: null,
  createdAt: new Date(DATE_FIXTURES.now),
  updatedAt: new Date(DATE_FIXTURES.now),
  projectId: 1,
  userId: "seed-user-alice",
};

// Tasks — string dates (HTTP serialization shape, for service tests)
export const mockTask: Task = toTask(TASK_FIXTURES[0]);
export const mockTask2: Task = toTask(TASK_FIXTURES[1]);
export const mockTask3: Task = toTask(TASK_FIXTURES[2]);
export const mockTasks: Task[] = TASK_FIXTURES.map(toTask);

export const mockNewTask: Task = {
  ...mockNewTaskWithDates,
  deadline: DATE_FIXTURES.futureDate,
  finishedAt: null,
  createdAt: DATE_FIXTURES.now,
  updatedAt: DATE_FIXTURES.now,
};

export const mockUpdatedTask: Task = {
  ...mockUpdatedTaskWithDates,
  deadline: DATE_FIXTURES.endDate,
  finishedAt: null,
  createdAt: DATE_FIXTURES.now,
  updatedAt: DATE_FIXTURES.now,
};

export const mockCreateTaskBody: CreateTaskBody = {
  name: "New Task",
  description: "New task description",
  priority: "MEDIUM",
  deadline: DATE_FIXTURES.futureDate,
  projectId: 1,
  userId: "seed-user-alice",
};

export const mockUpdateTaskBody: UpdateTaskBody = {
  name: "Updated Task",
  description: "Updated description",
  status: "IN_PROGRESS",
  priority: "HIGH",
  deadline: DATE_FIXTURES.endDate,
};

export { DATE_FIXTURES };
