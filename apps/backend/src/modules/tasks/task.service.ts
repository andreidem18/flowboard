import { CreateTaskBody, GetTasksQuery, UpdateTaskBody } from "@repo/shared";
import { taskRepository } from "./task.repository";

export const taskService = {
  getAll(filters: GetTasksQuery) {
    return taskRepository.getAll(filters);
  },

  getOne(id: number) {
    return taskRepository.getOne(id);
  },

  create(body: CreateTaskBody) {
    return taskRepository.create(body);
  },

  async delete(id: number) {
    await taskRepository.getOne(id);
    return taskRepository.delete(id);
  },

  async update(id: number, body: UpdateTaskBody) {
    await taskRepository.getOne(id);
    return taskRepository.update(id, body);
  },
};
