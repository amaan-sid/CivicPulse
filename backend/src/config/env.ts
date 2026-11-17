import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || process.env.BACKEND_PORT || 4000,
  MONGODB_URI: process.env.MONGODB_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "default_jwt_secret",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
};
