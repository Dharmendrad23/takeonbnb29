import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    hostId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    propertyType: {
      type: String,
      required: true,
    },

    pricePerNight: {
      type: Number,
      required: true,
      min: 1,
    },
    bedrooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    bathrooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    guestCapacity: {
      type: Number,
      default: 1,
      min: 1,
    },
    status: {
      type: String,
      default: "Draft",
    },
    approvalStatus: {
      type: String,
      default: "pending",
    },
    propertyCategory: {
      type: String,
      default: "All",
    },
    houseRules: {
      type: String,
      default: "",
    },
    checkInTime: {
      type: String,
      default: "",
    },
    checkOutTime: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalBookings: {
      type: Number,
      default: 0,
      min: 0,
    },

    amenities: [
      {
        type: String,
      },
    ],

    photos: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default mongoose.model("Property", propertySchema);