import { useMutation } from "@tanstack/react-query";
import type { GetAllTasks, TaskStatus } from "@repo/shared";
import { queryClient } from "~/providers/ReactQueryClientProvider";
import { TASKS_QUERY_KEY } from "../queries";
import env from "~/lib/env";

interface MoveTaskParams {
  fromIndex: number;
  toIndex: number;
  sourceStatus: TaskStatus;
  targetStatus: TaskStatus;
  taskId: number;
  projectId?: number;
}

export const useMoveTaskMutation = () => {
  return useMutation({
    mutationFn: async (params: MoveTaskParams) => {
      const response = await fetch(
        `${env.VITE_API_URL}/tasks/${params.taskId}/reorder`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newPosition: params.toIndex + 1, // convert to 1-based index for the backend
            newStatus: params.targetStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to move task");
      }

      return response.json();
    },
    onMutate: ({
      fromIndex,
      toIndex,
      sourceStatus,
      targetStatus,
      projectId,
    }) => {
      const sourceKey = [TASKS_QUERY_KEY, projectId, sourceStatus, undefined];
      const targetKey = [TASKS_QUERY_KEY, projectId, targetStatus, undefined];

      if (sourceStatus === targetStatus) {
        queryClient.setQueryData<GetAllTasks>(sourceKey, (prev) => {
          if (!prev || fromIndex === toIndex) return prev;
          const next = [...prev];
          const [moved] = next.splice(fromIndex, 1);
          next.splice(toIndex, 0, moved);
          return next;
        });
        return;
      }

      const sourceTasks = queryClient.getQueryData<GetAllTasks>(sourceKey);
      if (!sourceTasks) return;

      const task = sourceTasks[fromIndex];
      if (!task) return;

      const updatedTask = { ...task, status: targetStatus };

      queryClient.setQueryData<GetAllTasks>(sourceKey, (prev) => {
        if (!prev) return prev;
        return prev.filter((_, i) => i !== fromIndex);
      });

      queryClient.setQueryData<GetAllTasks>(targetKey, (prev) => {
        if (!prev) return [updatedTask];
        const next = [...prev];
        next.splice(toIndex, 0, updatedTask);
        return next;
      });
    },
    onError: (_, params) => {
      queryClient.invalidateQueries({
        queryKey: [
          TASKS_QUERY_KEY,
          params.projectId,
          params.sourceStatus,
          undefined,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          TASKS_QUERY_KEY,
          params.projectId,
          params.targetStatus,
          undefined,
        ],
      });
    },
    onSuccess: (_, params) => {
      // Invalidate the query to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: [
          TASKS_QUERY_KEY,
          params.projectId,
          params.sourceStatus,
          undefined,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          TASKS_QUERY_KEY,
          params.projectId,
          params.targetStatus,
          undefined,
        ],
      });
    },
  });
};
