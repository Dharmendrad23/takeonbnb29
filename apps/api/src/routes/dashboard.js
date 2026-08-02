import express from "express";
import Property from "../models/Property.js";
import Booking from "../models/Booking.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { hostId } = req.query;

    if (!hostId) {
      return res.status(400).json({
        success: false,
        message: "hostId is required",
      });
    }

    const properties = await Property.find({ hostId });

    const propertyIds = properties.map((p) => p._id);

    const bookings = await Booking.find({
      propertyId: { $in: propertyIds },
    }).populate("propertyId");

    const reviews = [];

    res.json({
      success: true,
      properties,
      bookings,
      reviews,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;