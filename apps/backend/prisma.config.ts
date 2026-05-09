import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // TODO: make a better handling of env variables
  datasource: {
    url: env("DATABASE_URL"),
  },
});
