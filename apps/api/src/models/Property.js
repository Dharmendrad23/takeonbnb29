import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

    propertyType: {
      type: String,
      enum: [
        "Apartment",
        "House",
        "Villa",
        "Room",
        "Hotel",
        "Resort",
        "Homestay",
      ],
      default: "Apartment",
    },

    location: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "India",
    },

    pincode: {
      type: String,
      default: "",
    },

    latitude: Number,
    longitude: Number,

    pricePerNight: {
      type: Number,
      required: true,
    },

    guests: {
      type: Number,
      default: 1,
    },

    bedrooms: {
      type: Number,
      default: 1,
    },

    beds: {
      type: Number,
      default: 1,
    },

    bathrooms: {
      type: Number,
      default: 1,
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

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 0,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Property", propertySchema);