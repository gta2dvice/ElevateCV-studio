import { Router } from "express";
import { createCheckoutSession } from "../controller/stripe.controller.js";
import { isUserAvailable } from "../middleware/authMiddleware.js";

const router = Router();

// Secure this route so only logged-in users can checkout
router.route("/create-checkout").post(isUserAvailable, createCheckoutSession);

export default router;