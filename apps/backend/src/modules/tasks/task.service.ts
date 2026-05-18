import {
  CreateTaskBody,
  Dashboard,
  GetTasksQuery,
  TaskStatus,
  UpdateTaskBody,
} from "@repo/shared";
import { taskRepository } from "./task.repository";
import { serializeTask, serializeUpcomingTasks } from "./task.serializers";
import { taskOrderingRepository } from "./task-ordering.repository";

export const taskService = {
  async getAll(filters: GetTasksQuery) {
    const tasks = await taskRepository.getAll(filters);
    return tasks.map(serializeTask);
  },

  async getOne(id: number) {
    const task = await taskRepository.getOne(id);
    return serializeTask(task);
  },

  async create(body: CreateTaskBody) {
    const task = await taskRepository.create(body);
    return serializeTask(task);
  },

  async delete(id: number) {
    await taskRepository.getOne(id);
    return taskRepository.delete(id);
  },

  async update(id: number, body: UpdateTaskBody) {
    await taskRepository.getOne(id);
    const task = await taskRepository.update(id, body);
    return serializeTask(task);
  },

  async reorder(id: number, newPosition: number, newStatus: TaskStatus) {
    const reorderedTask = await taskOrderingRepository.reorder(
      id,
      newPosition,
      newStatus,
    );
    return {
      newPosition: reorderedTask.position,
      newStatus: reorderedTask.status,
    };
  },

  async getDashboardData(): Promise<Dashboard> {
    const [taskCount, projectsWithTasks, upcomingTasks] = await Promise.all([
      taskRepository.getDashboardTaskCount(),
      taskRepository.getDashboardProjectsWithTasks(),
      taskRepository.getDashboardUpcomingTasks(),
    ]);

    const tasksByProjectFormatted = projectsWithTasks.map((project) => ({
      id: project.id,
      name: project.name,
      color: project.color,

      totalTasks: project.tasks.length,

      finishedTasks: project.tasks.filter((task) => task.status === "FINISHED")
        .length,

      inProgressTasks: project.tasks.filter(
        (task) => task.status === "IN_PROGRESS",
      ).length,

      notFinishedTasks: project.tasks.filter(
        (task) => task.status !== "FINISHED",
      ).length,
    }));

    return {
      taskCount,
      tasksByProject: tasksByProjectFormatted,
      upcomingTasks: serializeUpcomingTasks(upcomingTasks),
    };
  },
};
