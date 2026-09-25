// Simple in-memory rate limit for API routes (edge compatible via Map)
// Note: in serverless, memory is per-instance; for production use Redis/Upstash
const hits = new Map<string, { count: number; reset: number }>()

export function rateLimit(key: string, limit = 10, windowMs = 60_000): { ok: boolean; remaining: number; reset: number } {
  const now = Date.now()
  const entry = hits.get(key)
  if (!entry || now > entry.reset) {
    hits.set(key, { count: 1, reset: now + windowMs })
    return { ok: true, remaining: limit - 1, reset: now + windowMs }
  }
  if (entry.count >= limit) {
    return { ok: false, remaining: 0, reset: entry.reset }
  }
  entry.count++
  return { ok: true, remaining: limit - entry.count, reset: entry.reset }
}

export function getClientIp(req: Request): string {
  const fwd = (req.headers.get("x-forwarded-for") || "").split(",")[0]?.trim()
  return fwd || req.headers.get("x-real-ip") || "unknown"
}