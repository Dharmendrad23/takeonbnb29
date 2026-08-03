import express from "express";
import {
  register,
  login,
  me,
  requestOTP,
  verifyEmailOTP,
  requestPhoneOTP,
  verifyPhoneOTP,
  updateProfile,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/request-email-otp", requestOTP);
router.post("/verify-email-otp", verifyEmailOTP);

// Phone / generic OTP routes (used by frontend)
router.post("/request-otp", requestPhoneOTP);
router.post("/verify-otp", verifyPhoneOTP);

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.patch("/profile", authMiddleware, updateProfile);

export default router;
