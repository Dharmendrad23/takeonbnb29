import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET || "takeonbnb_secret",
    { expiresIn: "7d" }
  );
};

// Register
export const register = async (req, res) => {
  try {
    const { fullName, email, password, phone, role } = req.body;

    const exists = await User.findOne({
      email: email.toLowerCase(),
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hash,
      phone,
      role: role || "guest",
    });

    const token = createToken(user);

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createToken(user);

    res.json({
      success: true,
      token,
      user,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Current User
export const me = async (req, res) => {

  const user = await User.findById(req.user.id).select("-password");

  res.json(user);

};
import OtpSession from "../models/OtpSession.js";

// Request OTP
export const requestOTP = async (req, res) => {
  try {
    console.log("OTP REQUEST START", req.body);

    const { phone } = req.body;

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("OTP GENERATED", otpCode);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const otp = await OtpSession.create({
      phone,
      otpCode,
      expiresAt,
      attempts: 0,
      isVerified: false,
    });

    console.log("OTP SAVED", otp._id);

    res.json({
      success: true,
      otpId: otp._id,
      message: "OTP generated successfully",
    });

  } catch (error) {
    console.error("OTP ERROR", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};