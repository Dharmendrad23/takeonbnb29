import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  removeFromWishlistByProperty,
} from "../controllers/wishlistController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getWishlist);
router.post("/", addToWishlist);
router.delete("/remove", removeFromWishlistByProperty);
router.delete("/:id", removeFromWishlist);

export default router;
