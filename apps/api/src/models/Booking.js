import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    guestFullName: {
      type: String,
      required: true,
      trim: true,
    },

    guestEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    guestMobileNumber: {
      type: String,
      default: "",
      trim: true,
    },

    propertyName: {
      type: String,
      default: "",
      trim: true,
    },

    checkInDate: {
      type: Date,
      required: true,
    },

    checkOutDate: {
      type: Date,
      required: true,
    },

    guestCount: {
      type: Number,
      required: true,
      min: 1,
    },

    /* =========================================
       PRICING
    ========================================= */

    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },

    nights: {
      type: Number,
      required: true,
      min: 1,
    },

    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    internalMargin: {
      type: Number,
      default: 0,
      min: 0,
    },

    gst: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    /* =========================================
       BOOKING
    ========================================= */

    specialRequests: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
      ],
      default: "pending",
    },

    bookingStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
        "pending_verification",
      ],
      default: "pending",
    },

    /* =========================================
       PAYMENT
    ========================================= */

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "paid",
        "failed",
        "refunded",
      ],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      default: "",
      trim: true,
    },

    transactionId: {
      type: String,
      default: "",
      trim: true,
    },

    upiId: {
      type: String,
      default: "",
      trim: true,
    },

    /* =========================================
       RAZORPAY PAYMENT
    ========================================= */
    // RAZORPAY PAYMENT
    razorpayOrderId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    razorpayPaymentId: {
      type: String,
      default: "",
      trim: true,
    },

    razorpaySignature: {
      type: String,
      default: "",
      trim: true,
    },

    razorpayPaymentStatus: {
      type: String,
      default: "",
      trim: true,
    },

    razorpayPaymentMethod: {
      type: String,
      default: "",
      trim: true,
    },

    razorpayOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    razorpayCurrency: {
      type: String,
      default: "INR",
      trim: true,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    paymentVerifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Booking", bookingSchema);




