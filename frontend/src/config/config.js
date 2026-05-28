// ONLY store public-facing URLs in the frontend config.
// ALL secret API keys (Gemini, Database, etc.) MUST live in your backend .env file.

const VITE_APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:5001";

export { VITE_APP_URL };