import express from 'express';
import multer from 'multer';
import { upload } from "../middleware/multer.middleware.js"; // Ensure Multer is imported
import { 
  analyzeJobDescription, 
  generateAIContent, 
  transformResume, 
  optimizeExistingResume,
  getSkillSuggestions,
  generateCoverLetter 
} from '../controller/aiController.js'; // Updated to match your file naming
import { isUserAvailable } from '../middleware/authMiddleware.js'; // Updated to match your file naming

const router = express.Router();

/**
 * MULTER CONFIGURATION
 * Handles the PDF file upload as a buffer in memory for AI processing.
 * 5MB limit is standard for PDF resumes.
 */


// --- API ENDPOINTS ---

/**
 * @route   GET /api/ai/test
 * @desc    Health check for AI service
 * @access  Private
 */
router.get('/test', isUserAvailable, (req, res) => res.json({ message: "AI Router is operational" }));

/**
 * @route   POST /api/ai/analyze-jd
 * @desc    Audits a resume against a JD for Match Score and suggestions
 * @access  Private
 */
router.post('/analyze-jd', isUserAvailable, analyzeJobDescription);

/**
 * @route   POST /api/ai/generate-content
 * @desc    Generates professional summaries or bullet points
 * @access  Private
 */
router.post('/generate-content', isUserAvailable, generateAIContent);

/**
 * @route   POST /api/ai/transform-resume
 * @desc    Extracts text from PDF upload and creates optimized resume
 * @access  Private
 */
router.post(
  '/transform-resume', 
  isUserAvailable, 
  upload.single('resume'), 
  optimizeExistingResume
);

/**
 * @route   POST /api/ai/refine-json
 * @desc    Rewrites existing JSON data to match a specific JD
 * @access  Private
 */
router.post('/refine-json', isUserAvailable, transformResume);

router.route("/generate-cover-letter").post(
    upload.single("resumeFile"), // Middleware to handle PDF uploads[cite: 6]
    generateCoverLetter
);

router.post('/suggest-skills', isUserAvailable, getSkillSuggestions);

export default router;