import express from "express";

import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/:id", getUserById);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

router.patch("/:id/status", toggleUserStatus);

export default router;