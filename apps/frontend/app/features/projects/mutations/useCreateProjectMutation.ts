import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import env from "~/lib/env";
import { queryClient } from "~/providers/ReactQueryClientProvider";
import { getAllProjectsQueryOptions } from "../queries";
import type { CreateProjectBody, Project } from "@repo/shared";

interface Params {
  onSuccess?: () => void;
}

export const useCreateProjectMutation = ({ onSuccess }: Params = {}) => {
  return useMutation({
    mutationFn: async (body: CreateProjectBody) => {
      const res = await fetch(env.VITE_API_URL + "/projects", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw await res.json();
      return (await res.json()) as Project;
    },
    onError: (error) => {
      toast.error("Failed to create project");
      console.error("Error creating project:", error);
    },
    onSuccess: () => {
      // Invalidate the query to ensure fresh data
      queryClient.invalidateQueries(getAllProjectsQueryOptions());
      toast.success("Project created successfully");
      onSuccess?.();
    },
  });
};
