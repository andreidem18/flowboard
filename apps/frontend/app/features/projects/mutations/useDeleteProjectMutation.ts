import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import env from "~/lib/env";
import { queryClient } from "~/providers/ReactQueryClientProvider";
import { PROJECTS_QUERY_KEY } from "../queries";
import type { GetAllProjects, Project } from "@repo/shared";

interface Params {
  onSuccess?: () => void;
}

export const useDeleteProjectMutation = ({ onSuccess }: Params = {}) => {
  return useMutation({
    mutationFn: async (projectId: number) => {
      const res = await fetch(env.VITE_API_URL + `/projects/${projectId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw await res.json();
      return await res.json();
    },
    onMutate: async (projectId: number) => {
      // Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: [PROJECTS_QUERY_KEY] });

      // Snapshot the previous value
      const previousProjects = queryClient.getQueryData<GetAllProjects>([
        PROJECTS_QUERY_KEY,
      ]);

      // Optimistically update to the new value
      if (previousProjects) {
        queryClient.setQueryData<GetAllProjects>(
          [PROJECTS_QUERY_KEY],
          previousProjects.filter(
            (project: Project) => project.id !== projectId
          )
        );
      }

      // Return a context object with the snapshotted value
      return { previousProjects };
    },
    onError: (error, projectId, context) => {
      // If the mutation fails, use the context returned from onMutate to rollback
      if (context?.previousProjects) {
        queryClient.setQueryData(
          [PROJECTS_QUERY_KEY],
          context.previousProjects
        );
      }
    },
    onSuccess: () => {
      // Invalidate the query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
      toast.success("Project deleted successfully");
      onSuccess?.();
    },
  });
};
