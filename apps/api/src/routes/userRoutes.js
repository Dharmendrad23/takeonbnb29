import express from "express";

import {
  getUsersByIds,
  getUserById,
  updateUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

/* =========================================
   USERS
========================================= */

// GET /api/users?ids=id1,id2,id3
router.get("/", getUsersByIds);

// GET /api/users/:id
router.get("/:id", getUserById);

// PUT /api/users/:id
router.put("/:id", updateUserProfile);

export default router;