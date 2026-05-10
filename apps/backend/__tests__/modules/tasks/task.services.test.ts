import { describe, it, expect, beforeEach, vi } from "vitest";
import type { CreateTaskBody, UpdateTaskBody } from "@repo/shared";
import { taskService } from "@/modules/tasks/task.service";
import { taskRepository } from "@/modules/tasks/task.repository";
import {
  mockCreateTaskBody,
  mockUpdateTaskBody,
  mockTaskWithDates,
  mockTasksWithDates,
  mockNewTaskWithDates,
  mockUpdatedTaskWithDates,
  mockTask,
  mockTasks,
  mockNewTask,
  mockUpdatedTask,
} from "./mockData";

vi.mock("@/modules/tasks/task.repository", () => ({
  taskRepository: {
    getAll: vi.fn(),
    create: vi.fn(),
    getOne: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
  },
}));

describe("TaskService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all tasks from repository", async () => {
      vi.mocked(taskRepository.getAll).mockResolvedValue(mockTasksWithDates);

      const result = await taskService.getAll({});

      expect(result).toEqual(mockTasks);
      expect(taskRepository.getAll).toHaveBeenCalledWith({});
    });

    it("should pass filters to repository", async () => {
      const filters = { projectId: 1, userId: "user1" };
      vi.mocked(taskRepository.getAll).mockResolvedValue([mockTaskWithDates]);

      const result = await taskService.getAll(filters);

      expect(result).toEqual([mockTask]);
      expect(taskRepository.getAll).toHaveBeenCalledWith(filters);
    });

    it("should return an empty array when no tasks exist", async () => {
      vi.mocked(taskRepository.getAll).mockResolvedValue([]);

      const result = await taskService.getAll({});

      expect(result).toEqual([]);
    });
  });

  describe("getOne", () => {
    it("should return a task by id", async () => {
      vi.mocked(taskRepository.getOne).mockResolvedValue(mockTaskWithDates);

      const result = await taskService.getOne(1);

      expect(result).toEqual(mockTask);
      expect(taskRepository.getOne).toHaveBeenCalledWith(1);
    });

    it("should throw error when task does not exist", async () => {
      vi.mocked(taskRepository.getOne).mockRejectedValue(
        new Error("Task not found"),
      );

      await expect(taskService.getOne(999)).rejects.toThrow("Task not found");
    });
  });

  describe("create", () => {
    it("should create a new task", async () => {
      const createBody: CreateTaskBody = mockCreateTaskBody;

      vi.mocked(taskRepository.create).mockResolvedValue(mockNewTaskWithDates);

      const result = await taskService.create(createBody);

      expect(result).toEqual(mockNewTask);
      expect(taskRepository.create).toHaveBeenCalledWith(createBody);
    });
  });

  describe("delete", () => {
    it("should delete a task after verifying it exists", async () => {
      const taskId = 1;

      vi.mocked(taskRepository.getOne).mockResolvedValue(mockTaskWithDates);
      vi.mocked(taskRepository.delete).mockResolvedValue(undefined);

      await taskService.delete(taskId);

      expect(taskRepository.getOne).toHaveBeenCalledWith(taskId);
      expect(taskRepository.delete).toHaveBeenCalledWith(taskId);
    });

    it("should not delete if task does not exist", async () => {
      const taskId = 999;

      vi.mocked(taskRepository.getOne).mockRejectedValue(
        new Error("Task not found"),
      );

      await expect(taskService.delete(taskId)).rejects.toThrow(
        "Task not found",
      );
      expect(taskRepository.delete).not.toHaveBeenCalled();
    });

    it("should throw error when repository delete fails", async () => {
      const taskId = 1;

      vi.mocked(taskRepository.getOne).mockResolvedValue(mockTaskWithDates);
      vi.mocked(taskRepository.delete).mockRejectedValue(
        new Error("Delete failed"),
      );

      await expect(taskService.delete(taskId)).rejects.toThrow("Delete failed");
      expect(taskRepository.getOne).toHaveBeenCalledWith(taskId);
    });
  });

  describe("update", () => {
    it("should update a task after verifying it exists", async () => {
      const taskId = 1;
      const updateBody: UpdateTaskBody = mockUpdateTaskBody;

      vi.mocked(taskRepository.getOne).mockResolvedValue(mockTaskWithDates);
      vi.mocked(taskRepository.update).mockResolvedValue(
        mockUpdatedTaskWithDates,
      );

      const result = await taskService.update(taskId, updateBody);

      expect(result).toEqual(mockUpdatedTask);
      expect(taskRepository.getOne).toHaveBeenCalledWith(taskId);
      expect(taskRepository.update).toHaveBeenCalledWith(taskId, updateBody);
    });

    it("should not update if task does not exist", async () => {
      const taskId = 999;
      const updateBody: UpdateTaskBody = {
        name: "Updated Task",
      };

      vi.mocked(taskRepository.getOne).mockRejectedValue(
        new Error("Task not found"),
      );

      await expect(taskService.update(taskId, updateBody)).rejects.toThrow(
        "Task not found",
      );
      expect(taskRepository.update).not.toHaveBeenCalled();
    });

    it("should allow partial updates", async () => {
      const taskId = 1;
      const updateBody: UpdateTaskBody = {
        status: "FINISHED",
        finishedAt: new Date("2026-05-09").toISOString(),
      };

      const finishedTask = {
        ...mockTaskWithDates,
        status: "FINISHED" as const,
        finishedAt: new Date("2026-05-09"),
      };
      vi.mocked(taskRepository.getOne).mockResolvedValue(mockTaskWithDates);
      vi.mocked(taskRepository.update).mockResolvedValue(finishedTask);

      const result = await taskService.update(taskId, updateBody);

      expect(result.status).toEqual("FINISHED");
      expect(taskRepository.update).toHaveBeenCalledWith(taskId, updateBody);
    });

    it("should throw error when repository update fails", async () => {
      const taskId = 1;
      const updateBody: UpdateTaskBody = {
        name: "Updated Task",
      };

      vi.mocked(taskRepository.getOne).mockResolvedValue(mockTaskWithDates);
      vi.mocked(taskRepository.update).mockRejectedValue(
        new Error("Update failed"),
      );

      await expect(taskService.update(taskId, updateBody)).rejects.toThrow(
        "Update failed",
      );
      expect(taskRepository.getOne).toHaveBeenCalledWith(taskId);
    });
  });
});
