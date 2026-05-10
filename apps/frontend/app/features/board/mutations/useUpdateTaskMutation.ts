import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import env from "~/lib/env";
import { queryClient } from "~/providers/ReactQueryClientProvider";
import type { UpdateTaskBody, Task } from "@repo/shared";
import { TASKS_QUERY_KEY } from "../queries";

interface Params {
  taskId: number;
  projectId: number;
  onSuccess?: () => void;
}

export const useUpdateTaskMutation = ({
  taskId,
  projectId,
  onSuccess,
}: Params) => {
  return useMutation({
    mutationFn: async (body: UpdateTaskBody) => {
      const res = await fetch(env.VITE_API_URL + `/tasks/${taskId}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw await res.json();
      return (await res.json()) as Task;
    },
    onError: (error) => {
      toast.error("Failed to update task");
      console.error("Error updating task:", error);
    },
    onSuccess: () => {
      // Invalidate the queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY, projectId] });
      toast.success("Task updated successfully");
      onSuccess?.();
    },
  });
};
