import express from "express";
import Review from "../models/Review.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { propertyId, guestId } = req.query;
    const query = {};
    // Sanitize query params to prevent NoSQL injection
    if (propertyId && typeof propertyId === 'string') query.propertyId = String(propertyId);
    if (guestId && typeof guestId === 'string') query.guestId = String(guestId);
    const reviews = await Review.find(query)
      .populate("guestId", "name avatar")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate("guestId", "name avatar");
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const updateData = {};
    if (rating !== undefined) updateData.rating = Number(rating);
    if (comment !== undefined) updateData.comment = String(comment);
    const review = await Review.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
