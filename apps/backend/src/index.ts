import "dotenv/config";

import { Elysia } from "elysia";
import { node } from "@elysiajs/node";
import { ensureEnvValid, env } from "./lib/env";
import { routes } from "./modules";
import { errorHandler, requestLogger } from "./middlewares";
import openapi from "@elysia/openapi";
import z from "zod";
import { Tags } from "./constants";
import { cors } from "@elysia/cors";

ensureEnvValid();

const app = new Elysia({ adapter: node() });

app.onBeforeHandle(requestLogger);

app.onError(errorHandler);

app.use(
  cors({
    origin: [env.FRONT_URL],
    credentials: true,
  }),
);

app.use(
  openapi({
    mapJsonSchema: {
      zod: z.toJSONSchema,
    },
    documentation: {
      tags: [
        { name: Tags.project, description: "Projects related endpoints" },
        { name: Tags.task, description: "Tasks related endpoints" },
        { name: Tags.user, description: "User related endpoints" },
      ],
      info: {
        title: "API REST documentation for FlowBoard",
        version: "1.0",
        description: `For Auth Related endpoints, check ${env.BETTER_AUTH_URL}/api/v1/auth/openapi`,
      },
    },
  }),
);

app.use(routes);

app.get("/ping", async () => {
  return "pong";
});

app.listen(3000, ({ hostname, port }) => {
  console.log(`🟢 Backend running at ${hostname}:${port}`);
});
