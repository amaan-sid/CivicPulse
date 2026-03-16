import dotenv from "dotenv";

dotenv.config();

const normalizeOrigin = (value: string) => value.trim().replace(/\/$/, "");

const parseOrigins = (value: string | undefined) => {
  if (!value) {
    return ["http://localhost:3000", "http://localhost:5173"];
  }

  return value
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.BACKEND_PORT || 4000),
  mongoUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  corsOrigins: parseOrigins(process.env.CORS_ORIGINS || process.env.FRONTEND_URL),
  isProduction: process.env.NODE_ENV === "production"
};
