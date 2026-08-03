import express from "express";
import {
  getReviews,
  getReviewById,
  createReview,
  deleteReview,
} from "../controllers/reviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getReviews);
router.get("/:id", getReviewById);
router.post("/", authMiddleware, createReview);
router.delete("/:id", authMiddleware, deleteReview);

export default router;
