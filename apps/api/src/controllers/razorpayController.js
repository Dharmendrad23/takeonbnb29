import crypto from "crypto";
import mongoose from "mongoose";

import Booking from "../models/Booking.js";
import Property from "../models/Property.js";
import User from "../models/User.js";

import {
  createRazorpayOrder,
  fetchRazorpayOrder,
  fetchRazorpayPayment,
} from "../services/razorpayService.js";

const INTERNAL_MARGIN_RATE = 0.06;
const GST_RATE = 0.05;

const getNights = (checkInDate, checkOutDate) => {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  return Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) /
      (1000 * 60 * 60 * 24)
  );
};

const calculatePricing = (pricePerNight, nights) => {
  const basePrice = Math.round(
    Number(pricePerNight) * nights
  );

  const internalMargin = Math.round(
    basePrice * INTERNAL_MARGIN_RATE
  );

  const gst = Math.round(
    basePrice * GST_RATE
  );

  const totalAmount =
    basePrice +
    internalMargin +
    gst;

  return {
    basePrice,
    internalMargin,
    gst,
    totalAmount,
  };
};

/* =========================================
   CREATE RAZORPAY ORDER
========================================= */

export const createRazorpayPaymentOrder =
  async (req, res) => {
    let booking = null;

    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      if (req.user?.role !== "guest") {
        return res.status(403).json({
          success: false,
          message:
            "Only guest accounts can create bookings",
        });
      }

      const {
        propertyId,
        checkInDate,
        checkOutDate,
        guestCount,
        guestFullName,
        guestEmail,
        guestMobileNumber,
        specialRequests,
      } = req.body;

      if (
        !propertyId ||
        !checkInDate ||
        !checkOutDate ||
        !guestCount
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Property, dates and guest count are required",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(propertyId)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid property ID",
        });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Guest account not found",
        });
      }

      const property =
        await Property.findById(propertyId);

      if (!property) {
        return res.status(404).json({
          success: false,
          message: "Property not found",
        });
      }

      if (property.status !== "approved") {
        return res.status(400).json({
          success: false,
          message:
            "This property is not available for booking",
        });
      }

      const guests = Number(guestCount);

      const maxGuests = Number(
        property.maxGuests ||
          property.guestCapacity ||
          1
      );

      if (
        !Number.isInteger(guests) ||
        guests < 1 ||
        guests > maxGuests
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Maximum ${maxGuests} guests are allowed`,
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
          message:
            "Check-out must be after check-in",
        });
      }

      const nights = getNights(
        checkIn,
        checkOut
      );

      if (nights < 1) {
        return res.status(400).json({
          success: false,
          message:
            "Booking must be at least one night",
        });
      }

      /* =========================================
         AVAILABILITY CHECK
      ========================================= */

      const conflictingBooking =
        await Booking.findOne({
          propertyId,
          status: {
            $in: ["pending", "confirmed"],
          },
          checkInDate: {
            $lt: checkOut,
          },
          checkOutDate: {
            $gt: checkIn,
          },
        });

      if (conflictingBooking) {
        return res.status(409).json({
          success: false,
          message:
            "These dates are no longer available",
        });
      }

      /* =========================================
         SERVER-SIDE PRICE
      ========================================= */

      const pricePerNight =
        Number(property.pricePerNight);

      if (
        !Number.isFinite(pricePerNight) ||
        pricePerNight <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid property price",
        });
      }

      const {
        basePrice,
        internalMargin,
        gst,
        totalAmount,
      } = calculatePricing(
        pricePerNight,
        nights
      );

      /* =========================================
         MONGO BOOKING
      ========================================= */

      booking = await Booking.create({
        propertyId: property._id,

        guestId: user._id,

        guestFullName:
          String(
            guestFullName ||
              user.name ||
              ""
          ).trim(),

        guestEmail:
          String(
            guestEmail ||
              user.email ||
              ""
          )
            .trim()
            .toLowerCase(),

        guestMobileNumber:
          String(
            guestMobileNumber ||
              user.phone ||
              ""
          ).trim(),

        propertyName:
          property.title,

        checkInDate: checkIn,

        checkOutDate: checkOut,

        guestCount: guests,

        pricePerNight,

        nights,

        basePrice,

        internalMargin,

        gst,

        totalPrice: totalAmount,

        totalAmount,

        specialRequests:
          String(
            specialRequests || ""
          ).trim(),

        status: "pending",

        bookingStatus: "pending",

        paymentStatus: "pending",

        paymentMethod: "razorpay",
      });

      /* =========================================
         RAZORPAY ORDER
      ========================================= */

      const receipt =
        `TOB_${String(booking._id)}`;

      const razorpayOrder =
        await createRazorpayOrder({
          amount: totalAmount,
          receipt,
          notes: {
            bookingId: String(booking._id),
            propertyId: String(property._id),
            guestId: String(user._id),
          },
        });

      booking.razorpayOrderId =
        razorpayOrder.id;

      booking.razorpayOrderAmount =
        totalAmount;

      booking.razorpayCurrency =
        "INR";

      booking.paymentStatus =
        "processing";

      await booking.save();

      return res.status(201).json({
        success: true,

        bookingId:
          String(booking._id),

        razorpayOrderId:
          razorpayOrder.id,

        razorpayKeyId:
          process.env.RAZORPAY_KEY_ID,

        amount:
          totalAmount,

        currency: "INR",

        pricing: {
          basePrice,
          gst,
          totalAmount,
        },

        property: {
          name: property.title,
          description:
            property.description || "",
        },

        customer: {
          name:
            booking.guestFullName,
          email:
            booking.guestEmail,
          phone:
            booking.guestMobileNumber,
        },
      });
    } catch (error) {
      console.error(
        "[Razorpay] Create order error:",
        error
      );

      if (booking?._id) {
        await Booking.findByIdAndUpdate(
          booking._id,
          {
            status: "cancelled",
            bookingStatus: "cancelled",
            paymentStatus: "failed",
          }
        ).catch(() => {});
      }

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to create payment order",
      });
    }
  };

/* =========================================
   VERIFY RAZORPAY PAYMENT
========================================= */

export const verifyRazorpayPayment =
  async (req, res) => {
    try {
      const userId = req.user?.id;

      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Razorpay payment details are required",
        });
      }

      const booking =
        await Booking.findOne({
          razorpayOrderId:
            razorpay_order_id,
        });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message:
            "Booking for this payment was not found",
        });
      }

      if (
        String(booking.guestId) !==
        String(userId)
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You are not authorized for this booking",
        });
      }

      /* =========================================
         SIGNATURE VERIFICATION
      ========================================= */

      const generatedSignature =
        crypto
          .createHmac(
            "sha256",
            process.env.RAZORPAY_KEY_SECRET
          )
          .update(
            `${razorpay_order_id}|${razorpay_payment_id}`
          )
          .digest("hex");

      const signaturesMatch =
        crypto.timingSafeEqual(
          Buffer.from(generatedSignature),
          Buffer.from(razorpay_signature)
        );

      if (!signaturesMatch) {
        booking.paymentStatus =
          "failed";

        await booking.save();

        return res.status(400).json({
          success: false,
          message:
            "Invalid Razorpay payment signature",
        });
      }

      /* =========================================
         FETCH PAYMENT FROM RAZORPAY
      ========================================= */

      const payment =
        await fetchRazorpayPayment(
          razorpay_payment_id
        );

      const paymentAmount =
        Number(payment.amount) / 100;

      if (
        paymentAmount !==
        Number(booking.totalAmount)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Payment amount does not match booking amount",
        });
      }

      if (
        payment.currency !==
        "INR"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid payment currency",
        });
      }

      if (
        String(payment.order_id) !==
        String(booking.razorpayOrderId)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Payment order does not match booking",
        });
      }

      /* =========================================
         CAPTURED / PAID
      ========================================= */

      if (
        payment.status !==
        "captured"
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Payment status is ${payment.status}`,
        });
      }

      booking.razorpayPaymentId =
        razorpay_payment_id;

      booking.razorpaySignature =
        razorpay_signature;

      booking.razorpayPaymentStatus =
        payment.status;

      booking.razorpayPaymentMethod =
        payment.method || "";

      booking.paymentStatus =
        "paid";

      booking.status =
        "confirmed";

      booking.bookingStatus =
        "confirmed";

      booking.transactionId =
        razorpay_payment_id;

      booking.paidAt =
        new Date();

      booking.paymentVerifiedAt =
        new Date();

      await booking.save();

      return res.json({
        success: true,

        paid: true,

        bookingId:
          String(booking._id),

        orderId:
          booking.razorpayOrderId,

        paymentId:
          booking.razorpayPaymentId,

        paymentStatus:
          booking.paymentStatus,

        bookingStatus:
          booking.bookingStatus,

        amount:
          booking.totalAmount,

        currency: "INR",
      });
    } catch (error) {
      console.error(
        "[Razorpay] Verify payment error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to verify Razorpay payment",
      });
    }
  };

/* =========================================
   PAYMENT STATUS
========================================= */

export const getRazorpayPaymentStatus =
  async (req, res) => {
    try {
      const userId = req.user?.id;
      const { bookingId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          bookingId
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking ID",
        });
      }

      const booking =
        await Booking.findById(
          bookingId
        );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      if (
        String(booking.guestId) !==
        String(userId)
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You are not authorized for this booking",
        });
      }

      return res.json({
        success: true,

        bookingId:
          String(booking._id),

        razorpayOrderId:
          booking.razorpayOrderId,

        paymentStatus:
          booking.paymentStatus,

        bookingStatus:
          booking.bookingStatus,

        amount:
          booking.totalAmount,

        currency:
          booking.razorpayCurrency ||
          "INR",
      });
    } catch (error) {
      console.error(
        "[Razorpay] Payment status error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to fetch payment status",
      });
    }
  };
