import type { GetAllProjects } from "@repo/shared";
import { queryOptions } from "@tanstack/react-query";
import env from "~/lib/env";

export const getAllProjectsQueryOptions = () => {
  return queryOptions({
    queryKey: ["allProjects"],
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
