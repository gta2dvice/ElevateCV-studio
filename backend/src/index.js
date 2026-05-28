import app from "./app.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

console.log("Attempting to connect to Database..."); // Step 1 check

connectDB()
    .then(() => {
        console.log("Database connected successfully!"); // Step 2 check
        const port = process.env.PORT || 5001;
        app.listen(port, () => {
            console.log(`🚀 Server is running at: http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed: ", err);
        process.exit(1);
    });