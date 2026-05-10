import { useState } from "react";
import { useDeleteTaskMutation } from "../mutations";
import type { Task } from "@repo/shared";
import { useBoardStore } from "../stores/useBoardStore";

interface Props {
  task: Task;
  projectId: number;
}

export const useTaskCard = ({ task, projectId }: Props) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const { mutate: deleteTask, isPending } = useDeleteTaskMutation({
    projectId,
    status: task.status,
  });

  const selectCard = useBoardStore((s) => s.setSelectedTask);

  const isOverdue =
    task.deadline &&
    new Date(task.deadline) < new Date() &&
    task.status !== "FINISHED";

  const handleConfirmDelete = () => {
    deleteTask(task.id, {
      onSuccess: () => {
        setDeleteConfirmOpen(false);
      },
    });
  };

  return {
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    isPending,
    isOverdue,
    handleConfirmDelete,
    selectCard,
  };
};
