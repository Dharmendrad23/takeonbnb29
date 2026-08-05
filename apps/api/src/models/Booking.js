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

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

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
        "pending_verification",
        "rejected",
      ],
      default: "pending",
    },

    // Payment fields
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "verified", "failed"],
      default: "unpaid",
    },

    transactionId: {
      type: String,
      default: "",
    },

    paymentScreenshot: {
      type: String,
      default: "",
    },

    // Denormalized guest info for easy admin display
    guestFullName: {
      type: String,
      default: "",
    },

    propertyName: {
      type: String,
      default: "",
    },

    rejectReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Booking", bookingSchema);