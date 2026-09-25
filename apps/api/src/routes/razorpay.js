import express from "express";

import {
  createRazorpayPaymentOrder,
  createRazorpayPaymentLink,
  verifyRazorpayPayment,
  getRazorpayPaymentStatus,
  razorpayPaymentLinkCallback,
} from "../controllers/razorpayController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
 * Existing Standard Checkout route.
 * Kept temporarily for compatibility.
 */
router.post(
  "/create-order",
  authenticateToken,
  createRazorpayPaymentOrder
);

/*
 * NEW hosted Razorpay Payment Link.
 */
router.post(
  "/create-payment-link",
  authenticateToken,
  createRazorpayPaymentLink
);

/*
 * Existing Standard Checkout verification.
 */
router.post(
  "/verify",
  authenticateToken,
  verifyRazorpayPayment
);

/*
 * Razorpay hosted Payment Link callback.
 * DO NOT add authenticateToken here.
 */
router.get(
  "/payment-link/callback",
  razorpayPaymentLinkCallback
);

router.get(
  "/status/:bookingId",
  authenticateToken,
  getRazorpayPaymentStatus
);

export default router;
