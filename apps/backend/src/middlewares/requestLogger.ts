import { logger } from "@/lib/logger";

export const requestLogger = ({ request }: { request: Request }) => {
  logger.info({
    method: request.method,
    url: request.url,
  });
};
