import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

export const db = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined.");
  }

  connectionPromise = mongoose
    .connect(process.env.MONGODB_URI)
    .then((connection) => {
      console.log("MongoDB connected successfully");
      return connection;
    })
    .catch((error: Error) => {
      connectionPromise = null;
      console.error("MongoDB connection failed:", error.message);
      throw error;
    });

  return connectionPromise;
};
