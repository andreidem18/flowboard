import { useMutation } from "@tanstack/react-query"
import { type LoginBody, type LoginRes } from "@repo/shared"
import env from "~/lib/env"

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (body: LoginBody) => {
      const res = await fetch(env.VITE_API_URL + "/auth/sign-in/email", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!res.ok) throw await res.json()
      const data = (await res.json()) as LoginRes
      return data
    },
  })
}
