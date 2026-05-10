import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Project } from "@repo/shared";

interface ProjectsStore {
  selectedProject: Project | null;
  isDialogOpen: boolean;
  deleteConfirmOpen: boolean;
  projectToDelete: number | null;

  setSelectedProject: (project: Project | null) => void;
  setDialogOpen: (open: boolean) => void;
  setDeleteConfirmOpen: (open: boolean) => void;
  setProjectToDelete: (id: number | null) => void;
  resetDeleteState: () => void;
  resetFormState: () => void;
}

export const useProjectsStore = create<ProjectsStore>()(
  devtools(
    (set) => ({
      selectedProject: null,
      isDialogOpen: false,
      deleteConfirmOpen: false,
      projectToDelete: null,

      setSelectedProject: (project: Project | null) =>
        set({ selectedProject: project, isDialogOpen: true }),

      setDialogOpen: (open: boolean) => set({ isDialogOpen: open }),

      setDeleteConfirmOpen: (open: boolean) => set({ deleteConfirmOpen: open }),

      setProjectToDelete: (id: number | null) => set({ projectToDelete: id }),

      resetDeleteState: () =>
        set({
          projectToDelete: null,
          deleteConfirmOpen: false,
        }),

      resetFormState: () =>
        set({
          selectedProject: null,
          isDialogOpen: false,
        }),
    }),
    { name: "projects-store" }
  )
);
