import { prisma } from "@/lib/prisma";
import { CreateProjectBody, UpdateProjectBody } from "@repo/shared";
import { NotFoundError } from "elysia";

export const projectRepository = {
  getAll() {
    return prisma.project.findMany();
  },

  create(body: CreateProjectBody) {
    return prisma.project.create({ data: body });
  },

  async getOne(id: number) {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundError("Project not found");
    return project;
  },

  async delete(id: number) {
    await prisma.project.delete({ where: { id } });
  },

  update(id: number, body: UpdateProjectBody) {
    return prisma.project.update({ data: body, where: { id } });
  },
};
