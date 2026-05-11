import type { UseQueryResult } from "@tanstack/react-query";
import type { Task, Project } from "@repo/shared";

export function makeQueryResult<T>(data: T): UseQueryResult<T, Error> {
  return {
    data,
    isPending: false,
    error: null,
    isError: false,
    isSuccess: true,
    status: "success",
  } as unknown as UseQueryResult<T, Error>;
}

export function makeUndefinedQueryResult<T>(): UseQueryResult<T, Error> {
  return {
    data: undefined,
    isPending: false,
    error: null,
    isError: false,
    isSuccess: false,
    status: "pending",
  } as unknown as UseQueryResult<T, Error>;
}

export const mockProjects: Project[] = [
  {
    id: 1,
    name: "Frontend",
    description: "Frontend application",
    color: "#3b82f6",
  },
  { id: 2, name: "Backend", description: "Backend API", color: "#8b5cf6" },
  {
    id: 3,
    name: "Mobile",
    description: "Mobile application",
    color: "#ef4444",
  },
];

export const mockTask1: Task = {
  id: 1,
  name: "Task 1",
  description: "First task",
  priority: "HIGH",
  status: "NEW",
  deadline: null,
  finishedAt: null,
  projectId: 1,
  userId: "1",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  user: { name: "John Doe" },
  project: { name: "Test Project", color: "#3b82f6" },
};

export const mockTask2: Task = {
  ...mockTask1,
  id: 2,
  name: "Task 2",
  description: "Second task",
  priority: "MEDIUM",
};
