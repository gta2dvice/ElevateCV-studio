import { Router } from "express";
import {
  start,
  createResume,
  getALLResume,
  getResume,
  updateResume,
  removeResume,
} from "../controller/resumeController.js"; // Standardized name
import { generatePdf } from "../controller/pdfController.js"; // Standardized name
import { isUserAvailable } from "../middleware/authMiddleware.js"; // Standardized name

const router = Router();

/**
 * @desc    Test/Health check for Resume API
 * @access  Public
 */
router.get("/start", start);

/**
 * --- Resume CRUD Management ---
 * All these routes require a valid session via authMiddleware
 */


//ALL THE ROUTES

// 1. Create a new document
router.post("/", isUserAvailable, createResume);

// 2. Fetch all resumes for the logged-in user
router.get("/all", isUserAvailable, getALLResume);

// 3. Fetch a specific resume (Query param: ?id=xxxx)
router.get("/single", isUserAvailable, getResume);

// 4. Sync/Update resume data (Query param: ?id=xxxx)
router.put("/", isUserAvailable, updateResume);

// 5. Delete a resume (Query param: ?id=xxxx)
router.delete("/", isUserAvailable, removeResume);

/**
 * --- PDF Forge Engine ---
 * Generates high-fidelity PDF from the live resume URL
 */
router.get('/download/:resume_id', generatePdf);

export default router;