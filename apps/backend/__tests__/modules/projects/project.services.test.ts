import { describe, it, expect, beforeEach, vi } from "vitest";
import { projectService } from "@/modules/projects/project.services";
import { projectRepository } from "@/modules/projects/project.repository";

// Mock del repository
vi.mock("@/modules/projects/project.repository", () => ({
  projectRepository: {
    getAll: vi.fn(),
    create: vi.fn(),
    getOne: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
  },
}));

describe("ProjectService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all projects from repository", async () => {
      const mockProjects = [
        { id: 1, name: "Project 1" },
        { id: 2, name: "Project 2" },
      ];

      vi.mocked(projectRepository.getAll).mockResolvedValue(mockProjects);

      const result = await projectService.getAll();

      expect(result).toEqual(mockProjects);
      expect(projectRepository.getAll).toHaveBeenCalledOnce();
    });
  });

  describe("create", () => {
    it("should create a new project", async () => {
      const createBody = { name: "New Project" };
      const mockCreatedProject = { id: 1, name: "New Project" };

      vi.mocked(projectRepository.create).mockResolvedValue(mockCreatedProject);

      const result = await projectService.create(createBody);

      expect(result).toEqual(mockCreatedProject);
      expect(projectRepository.create).toHaveBeenCalledWith(createBody);
    });
  });

  describe("delete", () => {
    it("should delete a project after verifying it exists", async () => {
      const projectId = 1;
      const mockProject = { id: 1, name: "Project 1" };

      vi.mocked(projectRepository.getOne).mockResolvedValue(mockProject);
      vi.mocked(projectRepository.delete).mockResolvedValue(undefined);

      await projectService.delete(projectId);

      expect(projectRepository.getOne).toHaveBeenCalledWith(projectId);
      expect(projectRepository.delete).toHaveBeenCalledWith(projectId);
    });

    it("should not delete if project does not exist", async () => {
      const projectId = 999;

      vi.mocked(projectRepository.getOne).mockRejectedValue(
        new Error("Project not found"),
      );

      await expect(projectService.delete(projectId)).rejects.toThrow(
        "Project not found",
      );
      expect(projectRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update a project after verifying it exists", async () => {
      const projectId = 1;
      const updateBody = { name: "Updated Project" };
      const mockProject = { id: 1, name: "Project 1" };
      const mockUpdatedProject = { id: 1, name: "Updated Project" };

      vi.mocked(projectRepository.getOne).mockResolvedValue(mockProject);
      vi.mocked(projectRepository.update).mockResolvedValue(mockUpdatedProject);

      const result = await projectService.update(projectId, updateBody);

      expect(result).toEqual(mockUpdatedProject);
      expect(projectRepository.getOne).toHaveBeenCalledWith(projectId);
      expect(projectRepository.update).toHaveBeenCalledWith(
        projectId,
        updateBody,
      );
    });

    it("should not update if project does not exist", async () => {
      const projectId = 999;
      const updateBody = { name: "Updated Project" };

      vi.mocked(projectRepository.getOne).mockRejectedValue(
        new Error("Project not found"),
      );

      await expect(
        projectService.update(projectId, updateBody),
      ).rejects.toThrow("Project not found");
      expect(projectRepository.update).not.toHaveBeenCalled();
    });
  });
});
