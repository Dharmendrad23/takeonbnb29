import express from "express";
import mongoose from "mongoose";

import UnavailableDate from "../models/UnavailableDate.js";
import PropertyRate from "../models/PropertyRate.js";
import Property from "../models/Property.js";
import Booking from "../models/Booking.js";

const router = express.Router();

const normalizeDate = (value) => {
  const date = new Date(value);

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
};

const getDatesBetween = (startDate, endDate) => {
  const dates = [];
  let currentDate = normalizeDate(startDate);
  const lastDate = normalizeDate(endDate);

  while (currentDate <= lastDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

/* GET CALENDAR */

router.get("/:propertyId", async (req, res) => {
  try {
    const { propertyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const propertyObjectId =
      new mongoose.Types.ObjectId(propertyId);

    const blockedDates =
      await UnavailableDate.find({
        propertyId: propertyObjectId,
      })
        .sort({ date: 1 })
        .lean();

    const bookings =
      await Booking.find({
        propertyId: propertyObjectId,
        $or: [
          {
            status: {
              $in: ["pending", "confirmed"],
            },
          },
          {
            bookingStatus: {
              $in: [
                "pending",
                "confirmed",
                "pending_verification",
              ],
            },
          },
        ],
      })
        .sort({ checkInDate: 1 })
        .lean();

    const rate =
      await PropertyRate.findOne({
        propertyId: propertyObjectId,
      }).lean();

    const property =
      await Property.findById(propertyId).lean();

    return res.json({
      success: true,
      blockedDates,
      bookings,
      price:
        rate?.pricePerNight ||
        property?.pricePerNight ||
        property?.price ||
        0,
    });
  } catch (error) {
    console.error("GET CALENDAR ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load calendar",
    });
  }
});

/* BLOCK DATES */

router.post("/:propertyId/block", async (req, res) => {
  try {
    const { propertyId } = req.params;
    const {
      startDate,
      endDate,
      reason,
      blockedBy,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
    }

    const start = normalizeDate(startDate);
    const end = normalizeDate(endDate);

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }

    const dates = getDatesBetween(start, end);

    await UnavailableDate.bulkWrite(
      dates.map((date) => ({
        updateOne: {
          filter: {
            propertyId:
              new mongoose.Types.ObjectId(propertyId),
            date,
          },
          update: {
            $set: {
              propertyId:
                new mongoose.Types.ObjectId(propertyId),
              date,
              reason: reason || "Host blocked",
              blockedBy: blockedBy || "",
            },
          },
          upsert: true,
        },
      }))
    );

    return res.json({
      success: true,
      message: "Dates blocked successfully",
      count: dates.length,
    });
  } catch (error) {
    console.error("BLOCK DATES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to block dates",
    });
  }
});

/* UNBLOCK DATES */

router.delete("/:propertyId/unblock", async (req, res) => {
  try {
    const { propertyId } = req.params;
    const {
      startDate,
      endDate,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
    }

    const result =
      await UnavailableDate.deleteMany({
        propertyId:
          new mongoose.Types.ObjectId(propertyId),
        date: {
          $gte: normalizeDate(startDate),
          $lte: normalizeDate(endDate),
        },
      });

    return res.json({
      success: true,
      message: "Dates unblocked successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("UNBLOCK DATES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to unblock dates",
    });
  }
});

/* UPDATE PRICE */

router.put("/:propertyId/price", async (req, res) => {
  try {
    const { propertyId } = req.params;
    const price = Number(req.body.pricePerNight);

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    if (!Number.isFinite(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid price is required",
      });
    }

    const propertyObjectId =
      new mongoose.Types.ObjectId(propertyId);

    await PropertyRate.findOneAndUpdate(
      { propertyId: propertyObjectId },
      {
        $set: {
          pricePerNight: price,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    await Property.findByIdAndUpdate(
      propertyId,
      {
        pricePerNight: price,
        price,
      }
    );

    return res.json({
      success: true,
      message: "Price updated successfully",
      price,
    });
  } catch (error) {
    console.error("UPDATE PRICE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update price",
    });
  }
});

export default router;
