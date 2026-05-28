import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "career",
    });

    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);

    // Optional: Monitor connection issues after startup
    mongoose.connection.on("error", (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

    return conn;
  } catch (err) {
    // Excellent use of custom ApiError here
    throw new ApiError(500, "Database connection failed", [], err.stack);
  }
};

export { connectDB };