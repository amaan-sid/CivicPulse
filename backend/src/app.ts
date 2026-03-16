import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { db } from "./config/db";
import auditRoutes from "./routes/audit.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import authRoutes from "./routes/auth.routes";
import societyRoutes from "./routes/society.routes";
import issueRoutes from "./routes/issue.routes";
import userRoutes from "./routes/user.routes";
import { protect } from "./middlewares/auth.middleware";

export const app = express();

void db().catch((error: Error) => {
  console.error("Initial database bootstrap failed:", error.message);
});

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/society", societyRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/issues", auditRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

app.get("/api/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
