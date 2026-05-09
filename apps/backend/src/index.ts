import "dotenv/config";

import { Elysia } from "elysia";
import { node } from "@elysiajs/node";
import { prisma } from "./lib/prisma";
import { ensureEnvValid } from "./lib/env";
import { routes } from "./routes";
import { errorHandler, requestLogger } from "./middlewares";

ensureEnvValid();

const app = new Elysia({ adapter: node() });

app.onBeforeHandle(requestLogger);

app.onError(errorHandler);

app.use(routes);

app.get("/ping", async () => {
  return "pong";
});

app.listen(3000, ({ hostname, port }) => {
  console.log(`🟢 Backend running at ${hostname}:${port}`);
});
