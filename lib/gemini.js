import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "./logger";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Utility to execute a function with exponential backoff retries.
 */
export async function withRetries(fn, maxRetries = 3, initialDelay = 1000) {
  let lastError;
  const startTime = Date.now();

  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await fn();
      
      const duration = Date.now() - startTime;
      logger.info({
        msg: "AI request successful",
        duration: `${duration}ms`,
        attempts: i + 1,
      });

      return result;
    } catch (error) {
      lastError = error;
      
      // Don't retry if it's an authentication error or similar client-side issues
      const msg = error?.message?.toLowerCase() || "";
      if (msg.includes("unauthorized") || msg.includes("api_key") || msg.includes("invalid")) {
        throw error;
      }

      // If we have retries left, wait and try again
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        logger.warn({
          msg: "AI request failed, retrying...",
          attempt: i + 1,
          delay: `${delay}ms`,
          error: error.message,
        });
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  logger.error({
    msg: "AI request failed after maximum retries",
    duration: `${Date.now() - startTime}ms`,
    error: lastError.message,
  });

  throw lastError;
}
