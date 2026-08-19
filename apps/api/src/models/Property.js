import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    hostId: {
      type: String,
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    propertyType: {
      type: String,
      enum: [
        "apartment",
        "house",
        "villa",
        "room",
        "hotel",
        "cottage",
        "homestay",
        "resort",
        "other",
      ],
      required: true,
      lowercase: true,
      trim: true,
    },

    propertyCategory: {
      type: String,
      default: "All",
      trim: true,
    },

    maxGuests: {
      type: Number,
      default: 1,
      min: 1,
    },

    guestCapacity: {
      type: Number,
      default: 1,
      min: 1,
    },

    bedrooms: {
      type: Number,
      default: 1,
      min: 0,
    },

    beds: {
      type: Number,
      default: 1,
      min: 0,
    },

    bathrooms: {
      type: Number,
      default: 1,
      min: 0,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      default: "",
      trim: true,
    },

    country: {
      type: String,
      default: "India",
      trim: true,
    },

    pincode: {
      type: String,
      default: "",
      trim: true,
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    pricePerNight: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      default: 0,
    },

    amenities: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    photos: {
      type: [String],
      default: [],
    },

    coverImage: {
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

    houseRules: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Property", propertySchema);