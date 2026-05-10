import type { Dashboard } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import env from "~/lib/env";

export const DASHBOARD_QUERY_KEY = "dashboard";

export const useGetDashboardData = () => {
  return useQuery({
    queryKey: [DASHBOARD_QUERY_KEY],
    queryFn: async () => {
      const res = await fetch(env.VITE_API_URL + "/tasks/dashboard-data", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Error fetching dashboard data");
      }
      const data = await res.json();

      return data as Dashboard;
    },
  });
};
