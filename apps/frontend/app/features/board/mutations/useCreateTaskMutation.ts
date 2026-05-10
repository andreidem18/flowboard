import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import env from "~/lib/env";
import { queryClient } from "~/providers/ReactQueryClientProvider";
import { TASKS_QUERY_KEY } from "../queries";
import type { CreateTaskBody, Task } from "@repo/shared";

interface Params {
  projectId: number;
  onSuccess?: () => void;
}

export const useCreateTaskMutation = ({ projectId, onSuccess }: Params) => {
  return useMutation({
    mutationFn: async (body: CreateTaskBody) => {
      const res = await fetch(env.VITE_API_URL + "/tasks", {
        method: "POST",
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
      toast.error("Failed to create task");
      console.error("Error creating task:", error);
    },
    onSuccess: () => {
      // Invalidate the queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY, projectId] });
      toast.success("Task created successfully");
      onSuccess?.();
    },
  });
};
