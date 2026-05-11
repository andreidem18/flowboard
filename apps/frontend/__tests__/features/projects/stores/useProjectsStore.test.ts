import { describe, expect, it } from "vitest";
import { useProjectsStore } from "~/features/projects/stores/useProjectsStore";
import type { Project } from "@repo/shared";

vi.mock("zustand");

const mockProject: Project = {
  id: 1,
  name: "Test Project",
  description: "A test project",
  color: "#3b82f6",
};

describe("useProjectsStore", () => {
  it("starts with default state", () => {
    const state = useProjectsStore.getState();
    expect(state.selectedProject).toBeNull();
    expect(state.isDialogOpen).toBe(false);
    expect(state.deleteConfirmOpen).toBe(false);
    expect(state.projectToDelete).toBeNull();
  });

  it("setSelectedProject sets the project and opens the dialog", () => {
    useProjectsStore.getState().setSelectedProject(mockProject);
    const state = useProjectsStore.getState();
    expect(state.selectedProject).toEqual(mockProject);
    expect(state.isDialogOpen).toBe(true);
  });

  it("setSelectedProject(null) clears the project and opens the dialog", () => {
    useProjectsStore.getState().setSelectedProject(null);
    const state = useProjectsStore.getState();
    expect(state.selectedProject).toBeNull();
    expect(state.isDialogOpen).toBe(true);
  });

  it("setDialogOpen(false) closes the dialog", () => {
    useProjectsStore.getState().setSelectedProject(mockProject);
    useProjectsStore.getState().setDialogOpen(false);
    expect(useProjectsStore.getState().isDialogOpen).toBe(false);
  });

  it("resetDeleteState clears projectToDelete and closes delete confirm", () => {
    const { setProjectToDelete, setDeleteConfirmOpen, resetDeleteState } =
      useProjectsStore.getState();
    setProjectToDelete(5);
    setDeleteConfirmOpen(true);
    resetDeleteState();
    const state = useProjectsStore.getState();
    expect(state.projectToDelete).toBeNull();
    expect(state.deleteConfirmOpen).toBe(false);
  });

  it("resetFormState clears selectedProject and closes the dialog", () => {
    useProjectsStore.getState().setSelectedProject(mockProject);
    useProjectsStore.getState().resetFormState();
    const state = useProjectsStore.getState();
    expect(state.selectedProject).toBeNull();
    expect(state.isDialogOpen).toBe(false);
  });
});
