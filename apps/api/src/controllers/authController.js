import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import OtpSession from "../models/OtpSession.js";
import logger from "../utils/logger.js";

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

// Verify SMTP connection at startup so misconfiguration surfaces immediately in logs
if (transporter) {
  transporter.verify((err) => {
    if (err) {
      logger.error("[SMTP] Connection verification failed:", err.message, err.code || "");
    } else {
      logger.info("[SMTP] Connection verified — ready to send emails");
    }
  });
} else {
  logger.warn("[SMTP] Not configured — set SMTP_EMAIL and SMTP_PASSWORD env vars");
}

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
    logger.info(`[AUTH] register attempt — email: ${email}, role: ${role || "guest"}`);

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
      logger.warn(`[AUTH] register — email already registered: ${normalizedEmail}`);
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

    logger.info(`[AUTH] register success — userId: ${user._id}, email: ${normalizedEmail}`);

    return res.status(201).json({
      success: true,
      token,
      user: safeUser,
    });
  } catch (err) {
    logger.error("[AUTH] register error:", err.message, err.stack);

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
    logger.info(`[AUTH] login attempt — email: ${email}`);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      logger.warn(`[AUTH] login — user not found: ${normalizedEmail}`);
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      logger.warn(`[AUTH] login — wrong password for: ${normalizedEmail}`);
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createToken(user);
    const safeUser = await User.findById(user._id).select("-password");

    logger.info(`[AUTH] login success — userId: ${user._id}, email: ${normalizedEmail}`);

    return res.json({
      success: true,
      token,
      user: safeUser,
    });
  } catch (err) {
    logger.error("[AUTH] login error:", err.message, err.stack);

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
    logger.info(`[AUTH] request-email-otp — email: ${email}`);

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
        logger.info(`[AUTH] OTP email sent to: ${normalizedEmail}`);
      } catch (mailErr) {
        logger.error(`[AUTH] OTP email send failed to ${normalizedEmail}:`, mailErr.message, mailErr.code || "", mailErr.response || "");
      }
    } else {
      logger.warn("[AUTH] SMTP not configured — cannot send OTP email");
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
    logger.error("[AUTH] request-email-otp error:", err.message, err.stack);

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
    logger.info(`[AUTH] verify-email-otp — email: ${email}`);

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
      logger.warn(`[AUTH] verify-email-otp — invalid OTP for: ${normalizedEmail}`);
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (otp.expiresAt < new Date()) {
      logger.warn(`[AUTH] verify-email-otp — expired OTP for: ${normalizedEmail}`);
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    otp.isVerified = true;
    await otp.save();

    logger.info(`[AUTH] verify-email-otp success — email: ${normalizedEmail}`);

    return res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (err) {
    logger.error("[AUTH] verify-email-otp error:", err.message, err.stack);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};