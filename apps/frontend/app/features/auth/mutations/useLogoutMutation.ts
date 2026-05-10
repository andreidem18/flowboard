import { useMutation } from "@tanstack/react-query"
import env from "~/lib/env"
import { queryClient } from "~/providers/ReactQueryClientProvider"
import { getSessionQueryOptions } from "../hooks"

interface Params {
  onSuccess?: () => void
}

export const useLogoutMutation = ({ onSuccess }: Params = {}) => {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(env.VITE_API_URL + "/auth/sign-out", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!res.ok) throw await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(getSessionQueryOptions())
      queryClient.setQueryData(getSessionQueryOptions().queryKey, null)
      onSuccess?.()
    },
  })
}
