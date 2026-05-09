import { CreateProjectBody, UpdateProjectBody } from "@repo/shared";
import { projectRepository } from "./project.repository"

export const projectService = {
  getAll() {
    return projectRepository.getAll();
  },
  create(body: CreateProjectBody) {
    return projectRepository.create(body);
  },
  async delete(id: number) {
    await projectRepository.getOne(id);
    return projectRepository.delete(id);
  },
  async update(id: number, body: UpdateProjectBody) {
    await projectRepository.getOne(id);
    return projectRepository.update(id, body);
  },
}
