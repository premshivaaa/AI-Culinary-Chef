type TokenState = {
  windowStartMs: number;
  count: number;
  lastSeenMs: number;
};

/**
 * In-memory fixed-window rate limiter.
 *
 * Note: On serverless platforms (including Vercel), memory is per-instance.
 * This provides "best effort" limiting, not a global limit across all instances.
 */
export function rateLimit({ windowMs = 60_000, gcAfterMs = 10 * 60_000 } = {}) {
  const tokenCache = new Map<string, TokenState>();

  function gc(nowMs: number) {
    for (const [token, state] of tokenCache) {
      if (nowMs - state.lastSeenMs > gcAfterMs) tokenCache.delete(token);
    }
  }

  return {
    check: async (limit: number, token: string) => {
      const nowMs = Date.now();
      if (tokenCache.size > 10_000) gc(nowMs);

      const state = tokenCache.get(token);
      if (!state) {
        tokenCache.set(token, { windowStartMs: nowMs, count: 1, lastSeenMs: nowMs });
        return;
      }

      state.lastSeenMs = nowMs;
      const inSameWindow = nowMs - state.windowStartMs < windowMs;
      if (!inSameWindow) {
        state.windowStartMs = nowMs;
        state.count = 1;
        return;
      }

      state.count += 1;
      if (state.count > limit) throw new Error("rate_limited");
    },
  };
}

export const limiter = rateLimit();
