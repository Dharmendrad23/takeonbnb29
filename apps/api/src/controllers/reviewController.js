import Review from "../models/Review.js";
import Property from "../models/Property.js";

// GET reviews (filter by propertyId)
export const getReviews = async (req, res) => {
  try {
    const filter = {};
    if (req.query.propertyId) filter.propertyId = req.query.propertyId;
    if (req.query.guestId) filter.guestId = req.query.guestId;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const reviews = await Review.find(filter)
      .populate("guestId", "-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(filter);

    res.json({
      success: true,
      items: reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET single review
export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate(
      "guestId",
      "-password"
    );
    if (!review)
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST create review
export const createReview = async (req, res) => {
  try {
    const { propertyId, guestId, rating, reviewText } = req.body;

    const guestIdResolved = guestId || req.user?.id;
    if (!guestIdResolved) {
      return res
        .status(400)
        .json({ success: false, message: "Guest ID is required" });
    }

    const review = await Review.create({
      propertyId,
      guestId: guestIdResolved,
      rating,
      reviewText: reviewText || "",
    });

    // Update property average rating
    const allReviews = await Review.find({ propertyId });
    const avg =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Property.findByIdAndUpdate(propertyId, {
      rating: Math.round(avg * 10) / 10,
      reviewCount: allReviews.length,
    });

    const populated = await Review.findById(review._id).populate(
      "guestId",
      "-password"
    );

    res.status(201).json({ success: true, review: populated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review)
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
