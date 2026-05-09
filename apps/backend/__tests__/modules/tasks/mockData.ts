import type { Task, CreateTaskBody, UpdateTaskBody } from "@repo/shared";

// Las fechas en Prisma se devuelven como Date, pero los tipos de shared tienen strings
// Para los mocks del repository, usamos Dates porque es lo que retorna Prisma
type TaskWithDates = Omit<
  Task,
  "deadline" | "finishedAt" | "createdAt" | "updatedAt"
> & {
  deadline: Date | null;
  finishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const now = new Date("2026-05-09");
const pastDate = new Date("2026-05-01");
const futureDate = new Date("2026-06-01");
const midDate = new Date("2026-05-15");
const endDate = new Date("2026-05-20");
const finishedDate = new Date("2026-05-08");

// Mocks para repository (con Dates de Prisma)
export const mockTaskWithDates: TaskWithDates = {
  id: 1,
  name: "Task 1",
  description: "Task description",
  status: "NEW",
  priority: "MEDIUM",
  deadline: futureDate,
  finishedAt: null,
  createdAt: now,
  updatedAt: now,
  projectId: 1,
  userId: "user1",
};

export const mockTask2WithDates: TaskWithDates = {
  id: 2,
  name: "Task 2",
  description: "Another task",
  status: "IN_PROGRESS",
  priority: "HIGH",
  deadline: midDate,
  finishedAt: null,
  createdAt: now,
  updatedAt: now,
  projectId: 1,
  userId: "user1",
};

export const mockTask3WithDates: TaskWithDates = {
  id: 3,
  name: "Task 3",
  description: null,
  status: "FINISHED",
  priority: "LOW",
  deadline: null,
  finishedAt: finishedDate,
  createdAt: pastDate,
  updatedAt: finishedDate,
  projectId: 2,
  userId: "user2",
};

export const mockTasksWithDates: TaskWithDates[] = [
  mockTaskWithDates,
  mockTask2WithDates,
  mockTask3WithDates,
];

export const mockNewTaskWithDates: TaskWithDates = {
  id: 1,
  name: "New Task",
  description: "New task description",
  status: "NEW",
  priority: "MEDIUM",
  deadline: futureDate,
  finishedAt: null,
  createdAt: now,
  updatedAt: now,
  projectId: 1,
  userId: "user1",
};

export const mockUpdatedTaskWithDates: TaskWithDates = {
  id: 1,
  name: "Updated Task",
  description: "Updated description",
  status: "IN_PROGRESS",
  priority: "HIGH",
  deadline: endDate,
  finishedAt: null,
  createdAt: now,
  updatedAt: now,
  projectId: 1,
  userId: "user1",
};

// Mocks para service (con strings de serialización)
export const mockTask: Task = {
  id: 1,
  name: "Task 1",
  description: "Task description",
  status: "NEW",
  priority: "MEDIUM",
  deadline: futureDate.toISOString(),
  finishedAt: null,
  createdAt: now.toISOString(),
  updatedAt: now.toISOString(),
  projectId: 1,
  userId: "user1",
};

export const mockTask2: Task = {
  id: 2,
  name: "Task 2",
  description: "Another task",
  status: "IN_PROGRESS",
  priority: "HIGH",
  deadline: midDate.toISOString(),
  finishedAt: null,
  createdAt: now.toISOString(),
  updatedAt: now.toISOString(),
  projectId: 1,
  userId: "user1",
};

export const mockTask3: Task = {
  id: 3,
  name: "Task 3",
  description: null,
  status: "FINISHED",
  priority: "LOW",
  deadline: null,
  finishedAt: finishedDate.toISOString(),
  createdAt: pastDate.toISOString(),
  updatedAt: finishedDate.toISOString(),
  projectId: 2,
  userId: "user2",
};

export const mockTasks: Task[] = [mockTask, mockTask2, mockTask3];

export const mockNewTask: Task = {
  id: 1,
  name: "New Task",
  description: "New task description",
  status: "NEW",
  priority: "MEDIUM",
  deadline: futureDate.toISOString(),
  finishedAt: null,
  createdAt: now.toISOString(),
  updatedAt: now.toISOString(),
  projectId: 1,
  userId: "user1",
};

export const mockUpdatedTask: Task = {
  id: 1,
  name: "Updated Task",
  description: "Updated description",
  status: "IN_PROGRESS",
  priority: "HIGH",
  deadline: endDate.toISOString(),
  finishedAt: null,
  createdAt: now.toISOString(),
  updatedAt: now.toISOString(),
  projectId: 1,
  userId: "user1",
};

export const mockCreateTaskBody: CreateTaskBody = {
  name: "New Task",
  description: "New task description",
  priority: "MEDIUM",
  deadline: futureDate.toISOString(),
  projectId: 1,
  userId: "user1",
};

export const mockUpdateTaskBody: UpdateTaskBody = {
  name: "Updated Task",
  description: "Updated description",
  status: "IN_PROGRESS",
  priority: "HIGH",
  deadline: endDate.toISOString(),
};
