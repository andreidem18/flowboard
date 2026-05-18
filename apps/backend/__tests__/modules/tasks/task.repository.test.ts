import { describe, it, expect, beforeEach, vi } from "vitest";
import type { CreateTaskBody, UpdateTaskBody } from "@repo/shared";
import { taskRepository } from "@/modules/tasks/task.repository";
import { prisma } from "@/lib/prisma";
import { NotFoundError } from "elysia";
import {
  mockTaskWithDates,
  mockTask2WithDates,
  mockTasksWithDates,
  mockNewTaskWithDates,
  mockUpdatedTaskWithDates,
  mockCreateTaskBody,
  mockUpdateTaskBody,
} from "./mockData";

type transactionCallback = (prismaParam: typeof prisma) => Promise<unknown>;

vi.mock("@/lib/prisma", () => ({
  prisma: {
    task: {
      findMany: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    $transaction: async (callback: transactionCallback) =>
      await callback(prisma),
  },
}));

const include = ({ addOrder = false }: { addOrder?: boolean } = {}) => ({
  include: {
    project: {
      select: {
        color: true,
        name: true,
      },
    },
    user: { select: { name: true } },
  },
  ...(addOrder ? { orderBy: { position: "asc" } } : {}),
});

describe("TaskRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all tasks when no filters are provided", async () => {
      vi.mocked(prisma.task.findMany).mockResolvedValue(mockTasksWithDates);

      const result = await taskRepository.getAll({});

      expect(result).toEqual(mockTasksWithDates);
      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: {},
        ...include({ addOrder: true }),
      });
    });

    it("should return tasks filtered by projectId", async () => {
      const projectId = 1;
      const filteredTasks = [mockTaskWithDates, mockTask2WithDates];
      vi.mocked(prisma.task.findMany).mockResolvedValue(filteredTasks);

      const result = await taskRepository.getAll({ projectId });

      expect(result).toEqual(filteredTasks);
      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: { projectId },
        ...include({ addOrder: true }),
      });
    });

    it("should return tasks filtered by userId", async () => {
      const userId = "user1";
      const filteredTasks = [mockTaskWithDates, mockTask2WithDates];
      vi.mocked(prisma.task.findMany).mockResolvedValue(filteredTasks);

      const result = await taskRepository.getAll({ userId });

      expect(result).toEqual(filteredTasks);
      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: { userId },
        ...include({ addOrder: true }),
      });
    });

    it("should return tasks filtered by both projectId and userId", async () => {
      const projectId = 1;
      const userId = "user1";
      const filteredTasks = [mockTaskWithDates, mockTask2WithDates];
      vi.mocked(prisma.task.findMany).mockResolvedValue(filteredTasks);

      const result = await taskRepository.getAll({ projectId, userId });

      expect(result).toEqual(filteredTasks);
      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: { projectId, userId },
        ...include({ addOrder: true }),
      });
    });

    it("should return an empty array when no tasks exist", async () => {
      vi.mocked(prisma.task.findMany).mockResolvedValue([]);

      const result = await taskRepository.getAll({});

      expect(result).toEqual([]);
      expect(prisma.task.findMany).toHaveBeenCalledOnce();
    });
  });

  describe("create", () => {
    it("should create a new task", async () => {
      const createBody: CreateTaskBody = mockCreateTaskBody;

      vi.mocked(prisma.task.create).mockResolvedValue(mockNewTaskWithDates);

      const result = await taskRepository.create(createBody);

      expect(result).toEqual(mockNewTaskWithDates);
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: { ...createBody, position: 1 },
        ...include(),
      });
    });
  });

  describe("getOne", () => {
    it("should return a task when it exists", async () => {
      vi.mocked(prisma.task.findUnique).mockResolvedValue(mockTaskWithDates);

      const result = await taskRepository.getOne(1);

      expect(result).toEqual(mockTaskWithDates);
      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        ...include(),
      });
    });

    it("should throw NotFoundError when task does not exist", async () => {
      vi.mocked(prisma.task.findUnique).mockResolvedValue(null);

      await expect(taskRepository.getOne(999)).rejects.toThrow(NotFoundError);
      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
        ...include(),
      });
    });
  });

  describe("delete", () => {
    it("should delete a task by id", async () => {
      const taskId = 1;

      vi.mocked(prisma.task.delete).mockResolvedValueOnce(null as never);

      await taskRepository.delete(taskId);

      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: { id: taskId },
      });
    });
  });

  describe("update", () => {
    it("should update a task", async () => {
      const taskId = 1;
      const updateBody: UpdateTaskBody = mockUpdateTaskBody;

      vi.mocked(prisma.task.update).mockResolvedValue(mockUpdatedTaskWithDates);

      const result = await taskRepository.update(taskId, updateBody);

      expect(result).toEqual(mockUpdatedTaskWithDates);
      expect(prisma.task.update).toHaveBeenCalledWith({
        data: updateBody,
        where: { id: taskId },
        ...include(),
      });
    });
  });
});
