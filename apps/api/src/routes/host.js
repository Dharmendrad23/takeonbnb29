import express from "express";
import { loginAsHost } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginAsHost);

export default router;
