import type { GetAllUsers, GetAllUsersQuery } from "@repo/shared";
import { queryOptions } from "@tanstack/react-query";
import env from "~/lib/env";

export const getAllUsersQueryOptions = ({
  name,
}: GetAllUsersQuery | undefined = {}) => {
  return queryOptions({
    queryKey: ["tasks", name],
    queryFn: async () => {
      const url = new URL(`${env.VITE_API_URL}/user`);

      if (name) url.searchParams.append("name", name);

      const res = await fetch(url, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Error fetching users");
      }
      const data = await res.json();

      return data as GetAllUsers;
    },
  });
};
