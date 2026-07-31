import express from "express";
import {
  register,
  login,
  me,
  requestOTP,
  verifyEmailOTP,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/request-email-otp", requestOTP);
router.post("/verify-email-otp", verifyEmailOTP);

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);

export default router;