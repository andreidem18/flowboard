import { useMutation } from "@tanstack/react-query";
import { type SignupBody, type SignupRes } from "@repo/shared";
import env from "~/lib/env";

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: async (body: SignupBody) => {
      const res = await fetch(env.VITE_API_URL + "/auth/sign-up/email", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw await res.json();
      }
      const data = (await res.json()) as SignupRes;
      return data;
    },
  });
};
