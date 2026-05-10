import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import env from "~/lib/env";
import { queryClient } from "~/providers/ReactQueryClientProvider";
import { PROJECTS_QUERY_KEY } from "../queries";
import type { UpdateProjectBody, Project } from "@repo/shared";

interface Params {
  onSuccess?: () => void;
}

export const useUpdateProjectMutation = ({ onSuccess }: Params = {}) => {
  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: number;
      body: UpdateProjectBody;
    }) => {
      const res = await fetch(env.VITE_API_URL + `/projects/${id}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res);
      if (!res.ok) throw await res.json();
      return (await res.json()) as Project;
    },
    onError: (error) => {
      toast.error("Failed to update project");
      console.error("Error updating project:", error);
    },
    onSuccess: () => {
      // Invalidate the query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
      toast.success("Project updated successfully");
      onSuccess?.();
    },
  });
};
