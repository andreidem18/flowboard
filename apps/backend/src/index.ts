import "dotenv/config";

import { Elysia } from "elysia";
import { node } from "@elysiajs/node";
import { ensureEnvValid } from "./lib/env";
import { routes } from "./modules";
import { errorHandler, requestLogger } from "./middlewares";
import openapi from "@elysia/openapi";
import z from "zod";
import { Tags } from "./constants";

ensureEnvValid();

const app = new Elysia({ adapter: node() });

app.onBeforeHandle(requestLogger);

app.onError(errorHandler);

app.use(
  openapi({
    mapJsonSchema: {
      zod: z.toJSONSchema,
    },
    documentation: {
      tags: [
        { name: Tags.project, description: "Projects related endpoints" },
        { name: Tags.user, description: "User related endpoints" },
      ],
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
