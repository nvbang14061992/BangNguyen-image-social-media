import rateLimit from "express-rate-limit";
import { MAX_RATE_LIMITER, WINDOWS_RATE_LIMITER } from "../constants/app.constant";

export const rateLimiter = rateLimit({
    windowMs: WINDOWS_RATE_LIMITER, // 1 hour window
    max: MAX_RATE_LIMITER, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 1 hour"
});