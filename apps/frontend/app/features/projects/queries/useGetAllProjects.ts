import type { GetAllProjects } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import env from "~/lib/env";

export const PROJECTS_QUERY_KEY = "allProjects";

export const useGetAllProjects = () => {
  return useQuery({
    queryKey: [PROJECTS_QUERY_KEY],
    queryFn: async () => {
      const res = await fetch(env.VITE_API_URL + "/projects", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Error fetching projects");
      }
      const data = await res.json();

      return data as GetAllProjects;
    },
  });
};
