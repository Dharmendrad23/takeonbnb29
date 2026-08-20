import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    // HOST
    hostId: {
      type: String,
      required: true,
      index: true,
    },

    // BASIC DETAILS
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
        "farmstay",
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

    // GUESTS & ROOMS
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
      default: 0,
      min: 0,
    },

    beds: {
      type: Number,
      default: 0,
      min: 0,
    },

    bathrooms: {
      type: Number,
      default: 0,
      min: 0,
    },

    // LOCATION
    address: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
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

    // PRICING
    pricePerNight: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      default: 0,
    },

    // AMENITIES
    amenities: {
      type: [String],
      default: [],
    },

    // CLOUDINARY IMAGES
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

    // CHECK-IN / CHECK-OUT
    checkInTime: {
      type: String,
      default: "",
    },

    checkOutTime: {
      type: String,
      default: "",
    },

    // HOUSE RULES
    houseRules: {
      type: String,
      default: "",
    },

    // APPROVAL
    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
      ],
      default: "pending",
      index: true,
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    // RATING
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

export default mongoose.model(
  "Property",
  propertySchema
);