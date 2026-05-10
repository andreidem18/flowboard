import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAllProjectsQueryOptions } from "../queries";
import { useDeleteProjectMutation } from "../mutations";

export const useProjectsList = () => {
  const { data: projects, isLoading } = useQuery(getAllProjectsQueryOptions());
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const { mutateAsync: deleteProject } = useDeleteProjectMutation();

  const confirmDelete = async () => {
    if (projectToDelete) {
      await deleteProject(projectToDelete);
      setProjectToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  const handleDeleteProject = (id: number) => {
    setProjectToDelete(id);
    setDeleteConfirmOpen(true);
  };

  return {
    projects,
    isLoading,
    deleteConfirmOpen,
    confirmDelete,
    handleDeleteProject,
    setDeleteConfirmOpen,
  };
};
