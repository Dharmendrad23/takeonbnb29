import express from "express";

import {
  createRazorpayPaymentOrder,
  verifyRazorpayPayment,
  getRazorpayPaymentStatus,
} from "../controllers/razorpayController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/create-order",
  authenticateToken,
  createRazorpayPaymentOrder
);

router.post(
  "/verify",
  authenticateToken,
  verifyRazorpayPayment
);

router.get(
  "/status/:bookingId",
  authenticateToken,
  getRazorpayPaymentStatus
);

export default router;
