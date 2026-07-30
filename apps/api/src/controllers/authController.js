import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import OtpSession from "../models/OtpSession.js";
const createToken = (user) => {
  const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});
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
// Request Email OTP
export const requestOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const otpCode = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    await OtpSession.deleteMany({
      email: email.toLowerCase(),
    });

    await OtpSession.create({
      email: email.toLowerCase(),
      otpCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0,
      isVerified: false,
    });

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "TakeOnBNB Email Verification OTP",
      html: `
        <h2>TakeOnBNB</h2>
        <p>Your verification code is:</p>
        <h1>${otpCode}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    res.json({
      success: true,
      message: "OTP sent successfully.",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};