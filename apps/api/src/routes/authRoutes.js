import express from "express";
import { register, login } from "../controllers/authController.js";
import { authRateLimit } from "../middleware/global-rate-limit.js";

const router = express.Router();

router.post("/register", authRateLimit, register);
router.post("/login", authRateLimit, login);

export default router;