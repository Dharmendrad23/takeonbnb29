import express from "express";

import {
  register,
  login,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";

import { authRateLimit } from "../middleware/global-rate-limit.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();


/* =========================================
   PUBLIC ROUTES
========================================= */

router.post("/register", authRateLimit, register);

router.post("/login", authRateLimit, login);


/* =========================================
   AUTHENTICATED USER ROUTES
========================================= */

router.get("/profile", authenticateToken, getProfile);

router.put("/profile", authenticateToken, updateProfile);


export default router;