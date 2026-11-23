import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  /** Unix time in milliseconds when the window resets. */
  reset: number;
}

interface RateLimitRule {
  limit: number;
  window: Duration;
}

const RATE_LIMIT_RULES = {
  signIn: { limit: 5, window: "15 m" },
  // Checked inside the Credentials `authorize`, so direct POSTs to the callback are limited too.
  signInCallback: { limit: 5, window: "15 m" },
  register: { limit: 3, window: "1 h" },
  forgotPassword: { limit: 3, window: "1 h" },
  resetPassword: { limit: 5, window: "15 m" },
  resendVerification: { limit: 3, window: "15 m" },
} satisfies Record<string, RateLimitRule>;

export type RateLimitName = keyof typeof RATE_LIMIT_RULES;

// Give up on Redis quickly so a slow Upstash doesn't hold up sign-in.
const REDIS_TIMEOUT_MS = 2000;

let redis: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redis === undefined) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    redis = url && token ? new Redis({ url, token }) : null;
    if (!redis) console.warn("Upstash Redis is not configured; rate limiting is disabled.");
  }
  return redis;
}

const limiters = new Map<RateLimitName, Ratelimit>();

function getLimiter(name: RateLimitName): Ratelimit | null {
  const client = getRedis();
  if (!client) return null;

  let limiter = limiters.get(name);
  if (!limiter) {
    const rule: RateLimitRule = RATE_LIMIT_RULES[name];
    limiter = new Ratelimit({
      redis: client,
      limiter: Ratelimit.slidingWindow(rule.limit, rule.window),
      prefix: `ratelimit:${name}`,
      timeout: REDIS_TIMEOUT_MS,
    });
    limiters.set(name, limiter);
  }
  return limiter;
}

/** Counts one attempt. Fails open (allows the request) if Redis is missing or unavailable. */
export async function checkRateLimit(name: RateLimitName, key: string): Promise<RateLimitResult> {
  const limiter = getLimiter(name);
  if (!limiter) return { success: true, remaining: 0, reset: 0 };

  try {
    const { success, remaining, reset } = await limiter.limit(key);
    return { success, remaining, reset };
  } catch (error) {
    console.error(`Rate limit check failed (${name}):`, error);
    return { success: true, remaining: 0, reset: 0 };
  }
}

/** The client IP from Vercel's proxy headers, or "unknown" when there isn't one. */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip")?.trim() || "unknown";
}

export function getRetryAfterSeconds(reset: number): number {
  return Math.max(1, Math.ceil((reset - Date.now()) / 1000));
}

export function getRateLimitMessage(reset: number): string {
  const minutes = Math.max(1, Math.ceil(getRetryAfterSeconds(reset) / 60));
  return `Too many attempts. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`;
}

/** A 429 response for API routes, in the `{ success, data, error }` shape, with `Retry-After`. */
export function rateLimitResponse(reset: number): Response {
  return Response.json(
    { success: false, data: null, error: getRateLimitMessage(reset) },
    { status: 429, headers: { "Retry-After": String(getRetryAfterSeconds(reset)) } },
  );
}
