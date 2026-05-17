import { useSortable } from "@dnd-kit/react/sortable";
import { OptimisticSortingPlugin } from "@dnd-kit/dom/sortable";

import { useState } from "react";
import { useDeleteTaskMutation } from "../mutations";
import type { Task } from "@repo/shared";
import { useBoardStore } from "../stores/useBoardStore";

interface Props {
  task: Task;
  projectId: number;
  index: number;
}

export const useTaskCard = ({ task, projectId, index }: Props) => {
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

  const { ref: cardRef, isDropTarget } = useSortable({
    id: task.id,
    index,
    type: "task",
    accept: "task",
    group: task.status,
    plugins: (defaults) =>
      defaults.filter((p) => p !== OptimisticSortingPlugin),
  });

  return {
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    isPending,
    isOverdue,
    handleConfirmDelete,
    selectCard,
    cardRef,
    isDropTarget,
  };
};
