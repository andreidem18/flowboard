import type { GetAllTasks, GetTasksQuery } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import env from "~/lib/env";

export const TASKS_QUERY_KEY = "tasks";

export const useGetTasksByProjectId = ({
  projectId,
  status,
  userId,
}: GetTasksQuery) => {
  return useQuery({
    queryKey: [TASKS_QUERY_KEY, projectId, status, userId],
    queryFn: async () => {
      const url = new URL(`${env.VITE_API_URL}/tasks`);

      if (projectId !== undefined)
        url.searchParams.append("projectId", String(projectId));
      if (status !== undefined)
        url.searchParams.append("status", String(status));
      if (userId !== undefined)
        url.searchParams.append("userId", String(userId));

      const res = await fetch(url, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Error fetching tasks");
      }
      const data = await res.json();

      return data as GetAllTasks;
    },
  });
};
