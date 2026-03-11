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

import { protect } from "./middlewares/auth.middleware";

const app = express();
const PORT = process.env.BACKEND_PORT || 4000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/society", societyRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/issues", auditRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Test Protected Route
app.get("/api/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

// Database Connection
db();

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});