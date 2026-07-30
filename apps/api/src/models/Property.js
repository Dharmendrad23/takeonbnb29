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
      enum: ["apartment", "house", "villa", "room"],
      required: true,
    },

    pricePerNight: {
      type: Number,
      required: true,
      min: 1,
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
  }
);

export default mongoose.model("Property", propertySchema);