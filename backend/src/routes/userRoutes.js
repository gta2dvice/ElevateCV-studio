import { Router } from "express";
import {
  start,
  loginUser,
  logoutUser,
  registerUser,
} from "../controller/userController.js"; // Standardized to match screenshot
import { isUserAvailable } from "../middleware/authMiddleware.js"; // Standardized to match screenshot

const router = Router();

/**
 * @route   GET /api/users/
 * @desc    Verify session and return user data
 * @access  Private
 */
router.get("/", isUserAvailable, start);

/**
 * @route   POST /api/users/register
 * @desc    Register a new account
 * @access  Public
 */
router.post("/register", registerUser);

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user and set session cookie
 * @access  Public
 */
router.post("/login", loginUser);

/**
 * @route   GET /api/users/logout
 * @desc    Clear session cookie and end session
 * @access  Private
 */
router.get("/logout", logoutUser);

export default router;