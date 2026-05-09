import { describe, it, expect, beforeEach, vi } from "vitest";
import { projectRepository } from "@/modules/projects/project.repository";
import { prisma } from "@/lib/prisma";
import { NotFoundError } from "elysia";
import {
  mockProject,
  mockProjects,
  mockNewProject,
  mockUpdatedProject,
} from "./mockData";

// Mock de Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    project: {
      findMany: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("ProjectRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all projects", async () => {
      vi.mocked(prisma.project.findMany).mockResolvedValue(mockProjects);

      const result = await projectRepository.getAll();

      expect(result).toEqual(mockProjects);
      expect(prisma.project.findMany).toHaveBeenCalledOnce();
    });

    it("should return an empty array when no projects exist", async () => {
      vi.mocked(prisma.project.findMany).mockResolvedValue([]);

      const result = await projectRepository.getAll();

      expect(result).toEqual([]);
      expect(prisma.project.findMany).toHaveBeenCalledOnce();
    });
  });

  describe("create", () => {
    it("should create a new project", async () => {
      const createBody = { name: "New Project" };

      vi.mocked(prisma.project.create).mockResolvedValue(mockNewProject);

      const result = await projectRepository.create(createBody);

      expect(result).toEqual(mockNewProject);
      expect(prisma.project.create).toHaveBeenCalledWith({ data: createBody });
    });
  });

  describe("getOne", () => {
    it("should return a project when it exists", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue(mockProject);

      const result = await projectRepository.getOne(1);

      expect(result).toEqual(mockProject);
      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should throw NotFoundError when project does not exist", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue(null);

      await expect(projectRepository.getOne(999)).rejects.toThrow(
        NotFoundError,
      );
      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe("delete", () => {
    it("should delete a project", async () => {
      const projectId = 1;

      vi.mocked(prisma.project.delete).mockResolvedValueOnce(null as never);

      await projectRepository.delete(projectId);

      expect(prisma.project.delete).toHaveBeenCalledWith({
        where: { id: projectId },
      });
    });
  });

  describe("update", () => {
    it("should update a project", async () => {
      const projectId = 1;
      const updateBody = { name: "Updated Project" };

      vi.mocked(prisma.project.update).mockResolvedValue(mockUpdatedProject);

      const result = await projectRepository.update(projectId, updateBody);

      expect(result).toEqual(mockUpdatedProject);
      expect(prisma.project.update).toHaveBeenCalledWith({
        data: updateBody,
        where: { id: projectId },
      });
    });
  });
});
