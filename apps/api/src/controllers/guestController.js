import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import OtpSession from "../models/OtpSession.js";
import { sendEmail } from "../utils/mailer.js";

const JWT_SECRET = process.env.JWT_SECRET;
const OTP_EXPIRY_MINUTES = 5;

const generateToken = (user) =>
  jwt.sign({ id: user._id, email: user.email, userType: user.userType }, JWT_SECRET, {
    expiresIn: "30d",
  });

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  userType: user.userType,
});

// POST /auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const token = generateToken(user);
    res.json({ user: sanitizeUser(user), token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /auth/request-otp
export const requestOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const normalizedEmail = email.toLowerCase().trim();
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);

    const otp = await OtpSession.create({
      email: normalizedEmail,
      otpCode,
      expiresAt,
      attempts: 0,
      isVerified: false,
    });

    await sendEmail({
      to: normalizedEmail,
      subject: "Your TakeOnBnB verification code",
      text: `Your TakeOnBnB verification code is ${otpCode}. It expires in ${OTP_EXPIRY_MINUTES} minutes. Do not share this code with anyone.`,
    });

    res.status(201).json({ otpId: otp._id });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to send OTP" });
  }
};

const verifyOtpRecord = async (otpId, code) => {
  const otp = await OtpSession.findById(otpId);
  if (!otp) throw new Error("OTP session not found. Please request a new code.");
  if (otp.isVerified) throw new Error("This OTP has already been used.");
  if (new Date() > otp.expiresAt) throw new Error("OTP has expired. Please request a new one.");
  if (otp.otpCode !== code) {
    otp.attempts += 1;
    await otp.save();
    throw new Error("Invalid OTP code.");
  }
  otp.isVerified = true;
  await otp.save();
  return otp;
};

// POST /auth/signup-with-otp
export const signupWithOtp = async (req, res) => {
  try {
    const { name, email, password, userType, otpId, otpCode } = req.body;
    if (!name || !email || !password || !otpId || !otpCode) {
      return res.status(400).json({ message: "Name, email, password, otpId and otpCode are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const otp = await OtpSession.findById(otpId);
    if (!otp || otp.email !== normalizedEmail) {
      return res.status(400).json({ message: "OTP session not found for this email." });
    }

    await verifyOtpRecord(otpId, otpCode);

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      userType: userType || "guest",
    });

    const token = generateToken(user);
    res.status(201).json({ user: sanitizeUser(user), token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};