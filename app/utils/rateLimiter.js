export class RateLimiter {
  constructor({ windowMs = 60000, max = 25 } = {}) {
    this.windowMs = windowMs;
    this.max = max;
    this.map = new Map();
  }

  consume(key) {
    const now = Date.now();
    const entry = this.map.get(key);

    if (!entry || now > entry.resetAt) {
      this.map.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }

    if (entry.count >= this.max) return false;

    entry.count++;
    return true;
  }
}
