import express from "express";
import { getUsersByIds, getUserById } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsersByIds);
router.get("/:id", getUserById);

export default router;
