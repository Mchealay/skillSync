import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { logger } from "./logger";

const limiter =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(10, "1 h"),
        analytics: true,
        prefix: "@upstash/ratelimit",
      })
    : null;

export const ratelimit = limiter
  ? {
      ...limiter,
      limit: async (identifier) => {
        const result = await limiter.limit(identifier);
        if (!result.success) {
          logger.warn({
            msg: "Rate limit exceeded",
            identifier,
          });
        }
        return result;
      },
    }
  : null;
