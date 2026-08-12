import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Property from "../models/Property.js";
import User from "../models/User.js";

// GET ALL BOOKINGS
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("propertyId")
      .populate("guestId")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("Get bookings error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET BOOKING BY ID
export const getBookingById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(req.params.id)
      .populate("propertyId")
      .populate("guestId");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json(booking);
  } catch (err) {
    console.error("Get booking error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// CREATE BOOKING
export const createBooking = async (req, res) => {
  try {
    const {
      propertyId,
      guestId,
      guestFullName,
      guestEmail,
      guestMobileNumber,
      propertyName,
      checkInDate,
      checkOutDate,
      guestCount,
      totalPrice,
      totalAmount,
      specialRequests,
      status,
      bookingStatus,
      paymentStatus,
      paymentMethod,
      transactionId,
      upiId,
    } = req.body;

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        message: "Property ID is required",
      });
    }

    if (!guestId) {
      return res.status(400).json({
        success: false,
        message: "Guest ID is required. Please login first.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(guestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid guest ID",
      });
    }

    const guest = await User.findById(guestId);

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: "Guest account not found",
      });
    }

    if (guest.role !== "guest") {
      return res.status(403).json({
        success: false,
        message: "Only guest accounts can create bookings",
      });
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: "Check-in and check-out dates are required",
      });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (
      Number.isNaN(checkIn.getTime()) ||
      Number.isNaN(checkOut.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking dates",
      });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({
        success: false,
        message: "Check-out must be after check-in",
      });
    }

    const count = Number(guestCount || 1);

    if (count < 1) {
      return res.status(400).json({
        success: false,
        message: "At least one guest is required",
      });
    }

    // Check overlapping active bookings
    const conflictingBooking = await Booking.findOne({
      propertyId,
      status: { $in: ["pending", "confirmed"] },
      checkInDate: { $lt: checkOut },
      checkOutDate: { $gt: checkIn },
    });

    if (conflictingBooking) {
      return res.status(409).json({
        success: false,
        message: "This property is already booked for the selected dates",
      });
    }

    const amount = Number(totalAmount ?? totalPrice ?? 0);

    const booking = await Booking.create({
      propertyId,
      guestId,

      guestFullName: guestFullName || guest.name,
      guestEmail: guestEmail || guest.email,
      guestMobileNumber: guestMobileNumber || guest.phone || "",

      propertyName: propertyName || property.title || "",

      checkInDate: checkIn,
      checkOutDate: checkOut,

      guestCount: count,

      totalPrice: Number(totalPrice ?? amount),
      totalAmount: amount,

      specialRequests: specialRequests || "",

      status: status || "pending",
      bookingStatus: bookingStatus || "pending",

      paymentStatus: paymentStatus || "pending",
      paymentMethod: paymentMethod || "",

      transactionId: transactionId || "",
      upiId: upiId || "",
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("propertyId")
      .populate("guestId");

    console.log(
      `[BOOKING CREATED] ${booking._id} | Guest: ${guestId} | Property: ${propertyId}`
    );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: populatedBooking,
    });
  } catch (err) {
    console.error("Create booking error:", err);

    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// UPDATE BOOKING
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("propertyId")
      .populate("guestId");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (err) {
    console.error("Update booking error:", err);

    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// DELETE BOOKING
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (err) {
    console.error("Delete booking error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};