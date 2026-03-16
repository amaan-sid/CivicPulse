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

const parsePort = (value: string | undefined) => {
  const parsed = Number(value || 4000);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error("BACKEND_PORT must be a valid positive integer.");
  }

  return parsed;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parsePort(process.env.BACKEND_PORT),
  mongoUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  corsOrigins: parseOrigins(process.env.CORS_ORIGINS || process.env.FRONTEND_URL),
  isProduction: process.env.NODE_ENV === "production"
};

export const validateEnv = () => {
  if (!env.mongoUri) {
    throw new Error("MONGODB_URI is required.");
  }

  if (!env.jwtSecret) {
    throw new Error("JWT_SECRET is required.");
  }
};
