import type { GetLoggedUser } from "@repo/shared"
import { queryOptions, useQuery } from "@tanstack/react-query"
import env from "~/lib/env"

export const getSessionQueryOptions = () => {
  return queryOptions({
    queryKey: ["authSession"],
    queryFn: async () => {
      const res = await fetch(env.VITE_API_URL + "/api/v1/auth/get-session", {
        credentials: "include",
      })

      if (!res.ok) {
        throw new Error("Not authenticated")
      }
      const data = await res.json()

      return data as GetLoggedUser | null
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  })
}

export function useAuth() {
  const { data, isLoading, isError, refetch } = useQuery(
    getSessionQueryOptions()
  )

  return {
    user: data?.user ?? null,
    session: data?.session ?? null,
    loading: isLoading,
    isAuthenticated: !isError && !!data?.session,
    refresh: refetch,
  }
}
