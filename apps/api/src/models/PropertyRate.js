import mongoose from "mongoose";

const propertyRateSchema = new mongoose.Schema(
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
    rate: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default mongoose.model("PropertyRate", propertyRateSchema);
