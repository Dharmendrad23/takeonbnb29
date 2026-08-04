import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    guestId: {
      type: String,
      required: true,
      index: true,
    },
    propertyId: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default mongoose.model("Favorite", favoriteSchema);
