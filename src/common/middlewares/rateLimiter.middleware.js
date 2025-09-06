import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 1 hour"
});