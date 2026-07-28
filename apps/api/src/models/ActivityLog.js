import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    actionType: {
      type: String,
      required: true,
    },

    targetId: {
      type: String,
      required: true,
    },

    targetType: {
      type: String,
      required: true,
    },

    details: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ActivityLog", activityLogSchema);