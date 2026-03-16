import express from "express";
import { getCurrentUser, signup, login, logout } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";
import { rateLimitMiddleware } from "../middlewares/rateLimit.middleware";

const router = express.Router();

const authRateLimit = rateLimitMiddleware({
  limit: 10,
  windowMs: 15 * 60 * 1000,
  message: "Too many authentication attempts. Please try again in a few minutes."
});

router.post("/signup", authRateLimit, signup);
router.post("/login", authRateLimit, login);
router.post("/logout", logout);
router.get("/me", protect, getCurrentUser);

export default router;
