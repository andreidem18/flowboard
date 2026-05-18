import pino from "pino";
import { env } from "./env";

const isProduction =
  env.NODE_ENV === "production" || process.env.npm_lifecycle_event === "start";

export const logger = pino(
  isProduction
    ? {
        level: "info",
        timestamp: pino.stdTimeFunctions.isoTime,
      }
    : {
        level: "info",
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l",
            ignore: "pid,hostname",
          },
        },
      },
);
