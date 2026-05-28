import multer from "multer";

// Configure storage in memory so we can pass the buffer directly to the AI
const storage = multer.memoryStorage();

export const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit: 5MB
    },
    fileFilter: (req, file, cb) => {
        // Only allow PDF files for the AI Architect
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only .pdf files are supported!"), false);
        }
    }
});