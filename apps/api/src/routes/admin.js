import express from "express";
import ActivityLog from "../models/ActivityLog.js";
import Booking from "../models/Booking.js";
import logger from "../utils/logger.js";

const router = express.Router();

// POST /admin/activity-log
router.post("/activity-log", async (req, res) => {
  try {
    const { actionType, targetId, targetType, details } = req.body;

    if (!actionType || !targetId || !targetType) {
      return res.status(400).json({
        error: "actionType, targetId and targetType are required",
      });
    }

    const activityLog = await ActivityLog.create({
      actionType,
      targetId,
      targetType,
      details,
    });

    logger.info(`Activity log created: ${activityLog._id}`);

    res.status(201).json(activityLog);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// GET /admin/dashboard/stats
router.get("/dashboard/stats", async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();

    const pendingBookings = await Booking.countDocuments({
      status: "pending",
    });

    const confirmedBookings = await Booking.countDocuments({
      status: "confirmed",
    });

    const paidBookings = await Booking.find({
      status: {
        $in: ["confirmed", "completed"],
      },
    });

    const totalRevenue = paidBookings.reduce(
      (sum, booking) => sum + (booking.totalPrice || 0),
      0
    );

    let totalBookedNights = 0;

    paidBookings.forEach((booking) => {
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);

      totalBookedNights += Math.ceil(
        (checkOut - checkIn) / (1000 * 60 * 60 * 24)
      );
    });

    const occupancyRate =
      totalBookedNights > 0
        ? Number(((totalBookedNights / 365) * 100).toFixed(2))
        : 0;

    res.json({
      totalBookings,
      pendingBookings,
      confirmedBookings,
      totalRevenue,
      occupancyRate,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;