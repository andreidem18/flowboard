import "dotenv/config";
import { defineConfig } from "prisma/config";
import { env } from "./src/lib/env";


export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // TODO: make a better handling of env variables
  datasource: {
    url: env.DATABASE_URL,
  },
});
