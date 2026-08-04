import mongoose from "mongoose";

const unavailableDateSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default mongoose.model("UnavailableDate", unavailableDateSchema);
