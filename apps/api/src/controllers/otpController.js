import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import OtpSession from "../models/OtpSession.js";
import { sendEmail } from "../utils/mailer.js";

const JWT_SECRET = process.env.JWT_SECRET;
const OTP_EXPIRY_MINUTES = 5;
const MAX_ATTEMPTS = 5;

const generateOtpCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOtpMail = async (email, code) => {
  await sendEmail({
    to: email,
    subject: "Your TakeOnBnB verification code",
    text: `Your verification code is ${code}. It expires in ${OTP_EXPIRY_MINUTES} minutes. Do not share this code with anyone.`,
  });
};

export const requestLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this email" });
    }

    const otpCode = generateOtpCode();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);

    const session = await OtpSession.create({ email: user.email, otpCode, expiresAt });
    await sendOtpMail(user.email, otpCode);

    res.json({ success: true, otpId: session._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyLoginOtp = async (req, res) => {
  try {
    const { otpId, code } = req.body;
    if (!otpId || !code) {
      return res.status(400).json({ success: false, message: "otpId and code are required" });
    }

    const session = await OtpSession.findById(otpId);
    if (!session) {
      return res.status(404).json({ success: false, message: "OTP session not found" });
    }
    if (session.isVerified) {
      return res.status(400).json({ success: false, message: "OTP already used" });
    }
    if (new Date() > session.expiresAt) {
      return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
    }
    if (session.attempts >= MAX_ATTEMPTS) {
      return res.status(400).json({ success: false, message: "Too many attempts. Please request a new OTP." });
    }
    if (session.otpCode !== code) {
      session.attempts += 1;
      await session.save();
      return res.status(400).json({ success: false, message: "Invalid OTP code" });
    }

    session.isVerified = true;
    await session.save();

    const user = await User.findOne({ email: session.email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Account no longer exists" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      token,
      user: {
        ...user.toObject(),
        userType: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const requestSignupOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const otpCode = generateOtpCode();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);

    const session = await OtpSession.create({ email: email.toLowerCase().trim(), otpCode, expiresAt });
    await sendOtpMail(email, otpCode);

    res.json({ success: true, otpId: session._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifySignupOtp = async (req, res) => {
  try {
    const { otpId, code, name, password, role } = req.body;
    if (!otpId || !code || !name || !password) {
      return res.status(400).json({ success: false, message: "otpId, code, name and password are required" });
    }

    const session = await OtpSession.findById(otpId);
    if (!session) {
      return res.status(404).json({ success: false, message: "OTP session not found" });
    }
    if (session.isVerified) {
      return res.status(400).json({ success: false, message: "OTP already used" });
    }
    if (new Date() > session.expiresAt) {
      return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
    }
    if (session.attempts >= MAX_ATTEMPTS) {
      return res.status(400).json({ success: false, message: "Too many attempts. Please request a new OTP." });
    }
    if (session.otpCode !== code) {
      session.attempts += 1;
      await session.save();
      return res.status(400).json({ success: false, message: "Invalid OTP code" });
    }

    const existing = await User.findOne({ email: session.email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    session.isVerified = true;
    await session.save();

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: session.email,
      password: hashedPassword,
      role: role || "guest",
      isVerified: true,
    });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      success: true,
      token,
      user: {
        ...user.toObject(),
        userType: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};