import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

wishlistSchema.index({ guestId: 1, propertyId: 1 }, { unique: true });

export default mongoose.model("Wishlist", wishlistSchema);
