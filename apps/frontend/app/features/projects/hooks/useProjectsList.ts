import { useQuery } from "@tanstack/react-query";
import { getAllProjectsQueryOptions } from "../queries";
import { useDeleteProjectMutation } from "../mutations";
import { useProjectsStore } from "../stores/useProjectsStore";

export const useProjectsList = () => {
  const { data: projects, isLoading } = useQuery(getAllProjectsQueryOptions());
  const { mutateAsync: deleteProject } = useDeleteProjectMutation();

  const {
    deleteConfirmOpen,
    projectToDelete,
    setDeleteConfirmOpen,
    setProjectToDelete,
    resetDeleteState,
    setSelectedProject,
  } = useProjectsStore();

  const handleDeleteProject = (id: number) => {
    setProjectToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (projectToDelete) {
      await deleteProject(projectToDelete);
      resetDeleteState();
    }
  };

  return {
    projects,
    isLoading,
    deleteConfirmOpen,
    projectToDelete,
    confirmDelete,
    handleDeleteProject,
    setSelectedProject,
    setDeleteConfirmOpen,
  };
};
