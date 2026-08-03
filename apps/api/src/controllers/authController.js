import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import OtpSession from "../models/OtpSession.js";

const smtpConfigured =
  !!process.env.SMTP_EMAIL && !!process.env.SMTP_PASSWORD;

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  : null;

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET || "takeonbnb_secret",
    {
      expiresIn: "7d",
    }
  );
};

const normalizeEmail = (email = "") => email.trim().toLowerCase();

// ===================== REGISTER =====================

export const register = async (req, res) => {
  try {
    const { fullName, email, password, phone, role } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const exists = await User.findOne({ email: normalizedEmail });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hash,
      phone: phone || "",
      role: role || "guest",
    });

    const token = createToken(user);
    const safeUser = await User.findById(user._id).select("-password");

    return res.status(201).json({
      success: true,
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===================== LOGIN =====================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({ email: normalizedEmail });

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
    const safeUser = await User.findById(user._id).select("-password");

    return res.json({
      success: true,
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===================== CURRENT USER =====================

export const me = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  return res.json(user);
};

// ===================== REQUEST EMAIL OTP =====================

export const requestOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const otpCode = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    await OtpSession.deleteMany({ email: normalizedEmail });

    await OtpSession.create({
      email: normalizedEmail,
      otpCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0,
      isVerified: false,
    });

    let emailSent = false;

    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_EMAIL,
          to: normalizedEmail,
          subject: "TakeOnBNB Email Verification OTP",
          html: `
            <h2>TakeOnBNB</h2>
            <p>Your verification code is:</p>
            <h1>${otpCode}</h1>
            <p>This OTP is valid for 5 minutes.</p>
          `,
        });
        emailSent = true;
      } catch (mailErr) {
        console.error("[OTP EMAIL ERROR]", mailErr.message);
      }
    } else {
      console.warn("[OTP] SMTP not configured.");
    }

    if (!emailSent && process.env.NODE_ENV === "production") {
      return res.status(500).json({
        success: false,
        message: "Unable to send OTP email. Please try again later.",
      });
    }

    return res.json({
      success: true,
      message: emailSent
        ? "OTP sent successfully."
        : "Email service unavailable. Use dev OTP for testing.",
      ...(process.env.NODE_ENV !== "production" ? { devOtp: otpCode } : {}),
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===================== VERIFY EMAIL OTP =====================

export const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const otp = await OtpSession.findOne({
      email: normalizedEmail,
      otpCode: String(otpCode).trim(),
    });

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (otp.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    otp.isVerified = true;
    await otp.save();

    return res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ===================== REQUEST PHONE/GENERAL OTP =====================

export const requestPhoneOTP = async (req, res) => {
  try {
    const { phone, identifier } = req.body;
    const target = phone || identifier;

    if (!target) {
      return res.status(400).json({
        success: false,
        message: "Phone number or identifier is required",
      });
    }

    const otpCode = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    await OtpSession.deleteMany({ email: target });

    const session = await OtpSession.create({
      email: target,
      otpCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0,
      isVerified: false,
    });

    return res.json({
      success: true,
      otpId: session._id,
      message: "OTP generated successfully",
      ...(process.env.NODE_ENV !== "production" ? { devOtp: otpCode } : {}),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ===================== VERIFY PHONE/GENERAL OTP =====================

export const verifyPhoneOTP = async (req, res) => {
  try {
    const { otpId, otpCode, phone, identifier } = req.body;

    if (!otpCode) {
      return res.status(400).json({ success: false, message: "OTP code is required" });
    }

    let session;
    if (otpId) {
      session = await OtpSession.findById(otpId);
    } else {
      const target = phone || identifier;
      session = await OtpSession.findOne({ email: target });
    }

    if (!session) {
      return res.status(400).json({ success: false, message: "OTP session not found" });
    }

    if (session.otpCode !== String(otpCode).trim()) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (session.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    session.isVerified = true;
    await session.save();

    const target = session.email;
    const user = await User.findOne({
      $or: [{ phone: target }, { email: normalizeEmail(target) }],
    });

    if (user) {
      const token = createToken(user);
      const safeUser = await User.findById(user._id).select("-password");
      return res.json({ success: true, message: "OTP verified", token, user: safeUser });
    }

    return res.json({ success: true, message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ===================== UPDATE PROFILE =====================

export const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, profileImage } = req.body;
    const update = {};
    if (fullName) update.fullName = fullName.trim();
    if (phone !== undefined) update.phone = phone;
    if (profileImage !== undefined) update.profileImage = profileImage;

    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
