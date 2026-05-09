import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";

import { prisma } from "./prisma";
import { env } from "./env";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: ["*"],

  emailAndPassword: {
    enabled: true,
  },

  plugins: [openAPI({ path: "openapi" })],

  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL + "/api/v1/auth",
});
