import { Elysia } from "elysia";
import { randomUUID } from "node:crypto";
import { logger } from "@/lib/logger";

const getClientIp = (request: Request): string | undefined => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim();
  return request.headers.get("x-real-ip") ?? undefined;
};

const resolveStatus = (status: number | string | undefined): number => {
  if (typeof status === "number") return status;
  return 200;
};

const getLogFn = (status: number) => {
  if (status >= 500) return logger.error.bind(logger);
  if (status >= 400) return logger.warn.bind(logger);
  return logger.info.bind(logger);
};

type MaybeAuthedContext = { user?: { id: string } | null };

export const requestLogger = new Elysia({ name: "request-logger" })
  .derive({ as: "global" }, ({ request, set }) => {
    const requestId = request.headers.get("x-request-id") ?? randomUUID();
    set.headers["x-request-id"] = requestId;
    return {
      requestId,
      requestStartedAt: performance.now(),
    };
  })
  .onAfterResponse({ as: "global" }, (ctx) => {
    const { request, set, requestId, requestStartedAt } = ctx;
    const url = new URL(request.url);
    const status = resolveStatus(set.status);
    const durationMs = Number(
      (performance.now() - requestStartedAt).toFixed(2),
    );
    const userId = (ctx as MaybeAuthedContext).user?.id;

    getLogFn(status)({
      requestId,
      method: request.method,
      path: url.pathname,
      query: url.search ? url.search.slice(1) : undefined,
      status,
      durationMs,
      userId,
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent") ?? undefined,
      referer: request.headers.get("referer") ?? undefined,
    });
  });
