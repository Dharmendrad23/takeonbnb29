import express from "express";
import ActivityLog from "../models/ActivityLog.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Property from "../models/Property.js";
import logger from "../utils/logger.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// ADMIN AUTHENTICATION
router.use(authenticateToken);
router.use(requireAdmin);

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
    const [
      totalUsers,
      totalGuests,
      totalHosts,
      totalAdmins,
      totalProperties,
      pendingProperties,
      approvedProperties,
      rejectedProperties,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      paidBookings,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "guest" }),
      User.countDocuments({ role: "host" }),
      User.countDocuments({ role: "admin" }),

      Property.countDocuments(),
      Property.countDocuments({ status: "pending" }),
      Property.countDocuments({ status: "approved" }),
      Property.countDocuments({ status: "rejected" }),

      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "confirmed" }),

      Booking.find({
        status: {
          $in: ["confirmed", "completed"],
        },
      }),
    ]);

    const totalRevenue = paidBookings.reduce(
      (sum, booking) =>
        sum + Number(booking.totalPrice || 0),
      0
    );

    let totalBookedNights = 0;

    paidBookings.forEach((booking) => {
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);

      if (
        !Number.isNaN(checkIn.getTime()) &&
        !Number.isNaN(checkOut.getTime())
      ) {
        const nights = Math.ceil(
          (checkOut - checkIn) /
            (1000 * 60 * 60 * 24)
        );

        if (nights > 0) {
          totalBookedNights += nights;
        }
      }
    });

    const occupancyRate =
      totalBookedNights > 0
        ? Number(
            ((totalBookedNights / 365) * 100).toFixed(2)
          )
        : 0;

    return res.json({
      success: true,

      users: {
        total: totalUsers,
        guests: totalGuests,
        hosts: totalHosts,
        admins: totalAdmins,
      },

      properties: {
        total: totalProperties,
        pending: pendingProperties,
        approved: approvedProperties,
        rejected: rejectedProperties,
      },

      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
      },

      revenue: {
        total: totalRevenue,
      },

      totalBookings,
      pendingBookings,
      confirmedBookings,
      totalRevenue,
      occupancyRate,
      totalBookedNights,
    });
  } catch (err) {
    console.error(
      "[Admin Dashboard Stats Error]",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to load admin dashboard stats",
    });
  }
});

/* =========================================
   ADMIN USERS / HOSTS / GUESTS
========================================= */

router.get("/users", async (req, res) => {
  try {
    const users = await User.find(
      {
        role: {
          $in: ["host", "guest", "admin"],
        },
      },
      {
        password: 0,
      }
    )
      .sort({ createdAt: -1 })
      .lean();

    const total = users.length;
    const hosts = users.filter(
      (user) => user.role === "host"
    ).length;

    const guests = users.filter(
      (user) => user.role === "guest"
    ).length;

    const admins = users.filter(
      (user) => user.role === "admin"
    ).length;

    const verified = users.filter(
      (user) => user.isVerified === true
    ).length;

    return res.json({
      success: true,

      stats: {
        total,
        hosts,
        guests,
        admins,
        verified,
      },

      users,
    });

  } catch (err) {
    console.error(
      "[Admin Users Error]",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Failed to load users",
    });
  }
});

export default router;
