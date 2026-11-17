import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { db } from "@/config/db";
import { ENV } from "@/config/env";
import apiRouter from "@/routes";
import { protect } from "@/middlewares/auth.middleware";

const app = express();

const allowedOrigins = new Set(
  [
    ENV.FRONTEND_URL,
    ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : []),
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
  ]
    .map((o) => o?.trim().replace(/\/$/, ""))
    .filter(Boolean)
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin.replace(/\/$/, ""))) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Mount Centralized API Routes
app.use("/api", apiRouter);

// Test Protected Route
app.get("/api/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    uptimeSeconds: Math.round(process.uptime()),
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend is working",
  });
});

import { IssueService } from "@/services/issue.service";

// Database Connection & Initial SLA Escalation Check
db().then(async () => {
  try {
    const escalated = await IssueService.checkAndEscalateOverdueIssues();
    if (escalated > 0) {
      console.log(`[SLA Checker] Escalated ${escalated} overdue issues on startup`);
    }
  } catch (err) {
    console.error("[SLA Checker] Initial startup check error:", err);
  }
});

// Periodic SLA Escalation Check (every 30 seconds)
setInterval(async () => {
  try {
    const escalated = await IssueService.checkAndEscalateOverdueIssues();
    if (escalated > 0) {
      console.log(`[SLA Checker] Escalated ${escalated} newly overdue issues`);
    }
  } catch (err) {
    console.error("[SLA Checker] Periodic check error:", err);
  }
}, 30000);

// Start Server
app.listen(ENV.PORT, () => {
  console.log(`Server running at Port:${ENV.PORT}`);
});