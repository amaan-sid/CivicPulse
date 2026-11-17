import mongoose from "mongoose";
import { ENV } from "@/config/env";

export const db = async () => {
  try {
    if (!ENV.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    await mongoose.connect(ENV.MONGODB_URI);

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1); 
  }
};