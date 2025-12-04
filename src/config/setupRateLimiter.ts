import rateLimit from "express-rate-limit";

export const setupRateLimiter = () => rateLimit({
    windowMs: 1000,
    limit: 1,
    standardHeaders: "draft-8",
});