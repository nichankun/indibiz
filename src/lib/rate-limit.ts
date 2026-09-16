type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

/**
 * Lightweight single-process fallback. Deployments with multiple instances
 * should replace this with a shared Redis/database-backed limiter.
 */
export function consumeRateLimit({ key, limit, windowMs }: RateLimitOptions) {
  const now = Date.now();
  const current = buckets.get(key);
  const bucket = !current || current.resetAt <= now
    ? { count: 1, resetAt: now + windowMs }
    : { count: current.count + 1, resetAt: current.resetAt };

  buckets.set(key, bucket);

  if (buckets.size > MAX_BUCKETS) {
    for (const [bucketKey, value] of buckets) {
      if (value.resetAt <= now) buckets.delete(bucketKey);
    }

    // Jangan biarkan header IP unik dari bot membuat Map tumbuh tanpa batas.
    while (buckets.size > MAX_BUCKETS) {
      const oldestKey = buckets.keys().next().value as string | undefined;
      if (!oldestKey) break;
      buckets.delete(oldestKey);
    }
  }

  return {
    allowed: bucket.count <= limit,
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}
