import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

// 1. Import Optimized Routers (Updated paths based on your file tree)
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js"
import { handleStripeWebhook } from "./controller/stripe.controller.js";    

// 2. Import Global Error Middleware
import { errorHandler } from "./middleware/errorMiddleware.js";

// Load Environment Variables
dotenv.config();

const app = express();

// --- 3. GLOBAL MIDDLEWARE ---
const corsOptions = {
    // Uses environment variable for security, defaults to Vite dev server
    origin: process.env.ALLOWED_SITE || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));

// Parsing Middlewares with security limits
app.use(express.json({ limit: "16kb" })); 
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // Serves static assets if needed for PDFs
app.use(cookieParser());

// --- 4. API ROUTES ---
app.post(
    "/api/payments/webhook", 
    express.raw({ type: 'application/json' }), 
    handleStripeWebhook
);
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter); 
app.use("/api/payments", paymentRouter);

// --- 5. ERROR HANDLING ---

/**
 * 404 Not Found Middleware
 * Catch-all for routes that do not exist
 */
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

/**
 * Global Error Handler
 * Integrated with your standardized ApiError logic
 */
app.use(errorHandler);

export default app;