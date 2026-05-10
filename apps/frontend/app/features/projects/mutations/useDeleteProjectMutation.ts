import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import env from "~/lib/env";
import { queryClient } from "~/providers/ReactQueryClientProvider";
import { getAllProjectsQueryOptions } from "../queries";
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
      await queryClient.cancelQueries(getAllProjectsQueryOptions());

      // Snapshot the previous value
      const previousProjects = queryClient.getQueryData<GetAllProjects>(
        getAllProjectsQueryOptions().queryKey
      );

      // Optimistically update to the new value
      if (previousProjects) {
        queryClient.setQueryData<GetAllProjects>(
          getAllProjectsQueryOptions().queryKey,
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
          getAllProjectsQueryOptions().queryKey,
          context.previousProjects
        );
      }
    },
    onSuccess: () => {
      // Invalidate the query to ensure fresh data
      queryClient.invalidateQueries(getAllProjectsQueryOptions());
      toast.success("Project deleted successfully");
      onSuccess?.();
    },
  });
};
