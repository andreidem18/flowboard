import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import env from "~/lib/env";
import { queryClient } from "~/providers/ReactQueryClientProvider";
import { TASKS_QUERY_KEY } from "../queries";
import type { GetAllTasks, Task, TaskStatus } from "@repo/shared";

interface Params {
  projectId: number;
  status: TaskStatus;
  onSuccess?: () => void;
}

export const useDeleteTaskMutation = ({
  projectId,
  status,
  onSuccess,
}: Params) => {
  return useMutation({
    mutationFn: async (taskId: number) => {
      const res = await fetch(env.VITE_API_URL + `/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw await res.json();
      return await res.json();
    },
    onMutate: async (taskId: number) => {
      // Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({
        queryKey: [TASKS_QUERY_KEY, projectId, status],
      });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<GetAllTasks>([
        TASKS_QUERY_KEY,
        projectId,
        status,
      ]);

      // Optimistically update to the new value
      if (previousTasks) {
        queryClient.setQueryData<GetAllTasks>(
          [TASKS_QUERY_KEY, projectId, status],
          previousTasks.filter((task: Task) => task.id !== taskId)
        );
      }

      // Return a context object with the snapshotted value
      return { previousTasks };
    },
    onError: (error, taskId, context) => {
      // If the mutation fails, use the context returned from onMutate to rollback
      if (context?.previousTasks) {
        queryClient.setQueryData(
          [TASKS_QUERY_KEY, projectId, status],
          context.previousTasks
        );
      }
      toast.error("Failed to delete task");
    },
    onSuccess: () => {
      // Invalidate the query to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: [TASKS_QUERY_KEY, projectId, status],
      });
      toast.success("Task deleted successfully");
      onSuccess?.();
    },
  });
};
