import rateLimit from 'express-rate-limit';

/**
 * General API Rate Limiter
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

/**
 * Auth Endpoints Rate Limiter (Login / Register)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 authentication attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login/register attempts from this IP, please try again after 15 minutes',
  },
});

/**
 * URL Creation Rate Limiter
 */
export const urlCreateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 link shortenings per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'You have reached the link shortening limit. Please wait a few minutes before creating more URLs.',
  },
});

/**
 * Stricter Rate Limiter for AI Endpoints
 */
export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 AI Assistant queries per 15 min window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'AI Assistant rate limit reached. Please wait 15 minutes before making more AI queries.',
  },
});
