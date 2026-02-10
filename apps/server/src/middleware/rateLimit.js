const rateLimit = new Map();

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 100;

export function rateLimiter(c, next) {
    const ip = c.req.header('x-forwarded-for') || 'unknown';
    const now = Date.now();

    const record = rateLimit.get(ip);

    if (!record || now - record.windowStart > WINDOW_MS) {
        rateLimit.set(ip, { count: 1, windowStart: now });
        return next();
    }

    if (record.count >= MAX_REQUESTS) {
        return c.json({
            success: false,
            error: { message: 'Too many requests', status: 429 },
        }, 429);
    }

    record.count++;
    return next();
}
