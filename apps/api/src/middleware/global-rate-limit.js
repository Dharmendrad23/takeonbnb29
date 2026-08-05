import rateLimit from 'express-rate-limit';

export const globalRateLimit = rateLimit({
	windowMs: 5 * 60 * 1000,
	max: 600,
	standardHeaders: true,
	legacyHeaders: false,
	message: { error: 'Too many requests, please try again later' },
	validate: { trustProxy: false },
});

// Tighter, dedicated limiter for login/register so brute-force attempts don't
// exhaust the shared global quota and lock out other visitors.
export const authRateLimit = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 30,
	standardHeaders: true,
	legacyHeaders: false,
	message: { error: 'Too many login attempts, please try again later' },
	validate: { trustProxy: false },
});