import express from "express";
import {
  requestLoginOtp,
  verifyLoginOtp,
  requestSignupOtp,
  verifySignupOtp,
} from "../controllers/otpController.js";

const router = express.Router();

router.post("/request-login", requestLoginOtp);
router.post("/verify-login", verifyLoginOtp);

router.post("/request-signup", requestSignupOtp);
router.post("/verify-signup", verifySignupOtp);

export default router;