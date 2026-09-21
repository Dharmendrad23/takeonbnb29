import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

const twilioClient =
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN
    ? twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      )
    : null;

const VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;

const normalizePhone = (phone) => {
  if (!phone) return "";
  return String(phone).trim().replace(/\s+/g, "");
};

const checkTwilioConfig = () => {
  if (!twilioClient || !VERIFY_SERVICE_SID) {
    throw new Error(
      "Twilio Verify is not configured. Check TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_VERIFY_SERVICE_SID."
    );
  }
};

// ===============================
// LOGIN - REQUEST SMS OTP
// ===============================
export const requestLoginOtp = async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    checkTwilioConfig();

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this phone number",
      });
    }

    const verification = await twilioClient.verify.v2
      .services(VERIFY_SERVICE_SID)
      .verifications.create({
        to: phone,
        channel: "sms",
      });

    console.log("Twilio Login OTP:", phone, verification.status);

    return res.json({
      success: true,
      message: "OTP sent successfully",
      status: verification.status,
      phone,
    });
  } catch (err) {
    console.error("Login OTP Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Failed to send OTP",
    });
  }
};

// ===============================
// LOGIN - VERIFY SMS OTP
// ===============================
export const verifyLoginOtp = async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);
    const code = String(req.body.code || "").trim();

    if (!phone || !code) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP code are required",
      });
    }

    checkTwilioConfig();

    const verificationCheck = await twilioClient.verify.v2
      .services(VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: phone,
        code,
      });

    console.log(
      "Twilio Login Verification:",
      phone,
      verificationCheck.status
    );

    if (verificationCheck.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    user.isVerified = true;
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        ...user.toObject(),
        userType: user.role,
      },
    });
  } catch (err) {
    console.error("Verify Login OTP Error:", err);

    return res.status(400).json({
      success: false,
      message: err.message || "OTP verification failed",
    });
  }
};

// ===============================
// SIGNUP - REQUEST SMS OTP
// ===============================
export const requestSignupOtp = async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    checkTwilioConfig();

    const existing = await User.findOne({ phone });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    const verification = await twilioClient.verify.v2
      .services(VERIFY_SERVICE_SID)
      .verifications.create({
        to: phone,
        channel: "sms",
      });

    console.log("Twilio Signup OTP:", phone, verification.status);

    return res.json({
      success: true,
      message: "OTP sent successfully",
      status: verification.status,
      phone,
    });
  } catch (err) {
    console.error("Signup OTP Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Failed to send OTP",
    });
  }
};

// ===============================
// SIGNUP - VERIFY SMS OTP
// ===============================
export const verifySignupOtp = async (req, res) => {
  try {
    const {
      phone: rawPhone,
      code,
      name,
      password,
      role,
      email,
    } = req.body;

    const phone = normalizePhone(rawPhone);

    if (!phone || !code || !name || !password || !email) {
      return res.status(400).json({
        success: false,
        message:
          "Phone, OTP code, name, email and password are required",
      });
    }

    checkTwilioConfig();

    const verificationCheck = await twilioClient.verify.v2
      .services(VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: phone,
        code: String(code).trim(),
      });

    console.log(
      "Twilio Signup Verification:",
      phone,
      verificationCheck.status
    );

    if (verificationCheck.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    const existingPhone = await User.findOne({ phone });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingEmail = await User.findOne({
      email: normalizedEmail,
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      role: role || "guest",
      isVerified: true,
    });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: {
        ...user.toObject(),
        userType: user.role,
      },
    });
  } catch (err) {
    console.error("Verify Signup OTP Error:", err);

    return res.status(400).json({
      success: false,
      message: err.message || "OTP verification failed",
    });
  }
};