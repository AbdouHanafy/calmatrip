// lib/rateLimit.ts
// Simple in-memory sliding-window rate limiter for public form endpoints.
// In-memory means limits reset on server restart and aren't shared across
// instances — fine for this single-instance deployment, not a substitute
// for an edge/CDN-level limiter under real abuse.

const hits = new Map<string, number[]>();

// Periodically drop stale keys so the map doesn't grow unbounded.
setInterval(
  () => {
    const cutoff = Date.now() - 10 * 60 * 1000;
    for (const [key, timestamps] of hits) {
      const kept = timestamps.filter((t) => t > cutoff);
      if (kept.length === 0) hits.delete(key);
      else hits.set(key, kept);
    }
  },
  5 * 60 * 1000,
).unref?.();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  const timestamps = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= limit) {
    hits.set(key, timestamps);
    return false;
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return true;
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
