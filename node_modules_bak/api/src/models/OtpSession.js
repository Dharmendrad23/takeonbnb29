import mongoose from "mongoose";

const otpSessionSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    otpCode: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("OtpSession", otpSessionSchema);