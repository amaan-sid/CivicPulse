import dotenv from "dotenv";

dotenv.config();

const normalizeOrigin = (value: string) => value.trim().replace(/\/$/, "");
const isHttpOrigin = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const defaultCorsOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173"
];

const parseOrigins = (...values: Array<string | undefined>) => {
  const mergedOrigins = new Set(defaultCorsOrigins.map(normalizeOrigin));

  values
    .filter(Boolean)
    .flatMap((value) => value!.split(","))
    .map(normalizeOrigin)
    .filter(Boolean)
    .forEach((origin) => {
      if (!isHttpOrigin(origin)) {
        console.warn(`Ignoring invalid CORS origin: ${origin}`);
        return;
      }

      mergedOrigins.add(origin);
    });

  const result = Array.from(mergedOrigins);
  console.log("CORS Origins loaded:", result);
  return result;
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
  corsOrigins: parseOrigins(process.env.CORS_ORIGINS, process.env.FRONTEND_URL),
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
