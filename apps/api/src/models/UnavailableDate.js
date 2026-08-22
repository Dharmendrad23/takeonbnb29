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
      index: true,
    },
    reason: {
      type: String,
      default: "Host blocked",
    },
    blockedBy: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

unavailableDateSchema.index(
  { propertyId: 1, date: 1 },
  { unique: true }
);

export default mongoose.model(
  "UnavailableDate",
  unavailableDateSchema
);
