import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { db } from "@/config/db";
import { ENV } from "@/config/env";
import apiRouter from "@/routes";
import { protect } from "@/middlewares/auth.middleware";

const app = express();

app.use(
  cors({
    origin: ENV.FRONTEND_URL,
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

app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend is working",
  });
});

// Database Connection
db();

// Start Server
app.listen(ENV.PORT, () => {
  console.log(`Server running at Port:${ENV.PORT}`);
});