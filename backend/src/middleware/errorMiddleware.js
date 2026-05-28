import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

/**
 * Global Error Handling Middleware
 * Catch-all for every error in the application.
 */
const errorHandler = (err, req, res, next) => {
    let error = err;

    // 1. Check if the error is already an instance of our custom ApiError
    if (!(error instanceof ApiError)) {
        // If not (e.g., a native Mongoose error or Axios error), convert it
        const statusCode =
            error.statusCode || (error instanceof mongoose.Error ? 400 : 500);
        
        const message = error.message || "Something went wrong on the server";
        
        error = new ApiError(statusCode, message, error?.errors || [], err.stack);
    }

    // 2. Prepare the production-safe response
    const response = {
        success: false,
        statusCode: error.statusCode,
        message: error.message,
        errors: error.errors,
        // CRITICAL: Only leak stack trace in Development mode
        ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
    };

    // Log the error for the developer (you can use a logger like Winston here)
    console.error(`[Error] ${req.method} ${req.url} - ${error.message}`);

    return res.status(error.statusCode).json(response);
};

export { errorHandler };