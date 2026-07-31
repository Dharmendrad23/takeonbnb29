import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import OtpSession from "../models/OtpSession.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

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

// ===================== REGISTER =====================

export const register = async (req, res) => {
  try {
    const { fullName, email, password, phone, role } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

if (password.length < 8) {
  return res.status(400).json({
    success: false,
    message: "Password must be at least 8 characters",
  });
}

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

   const exists = await User.findOne({
  email: normalizedEmail,
});

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hash = await bcrypt.hash(password, 10);
Next year construction profile Hello hello, good afternoon. My shooty bold video architect and developer inquiry architecture interior design in kindergarten developers architectural format like construction, engine design that's why I called you O'Keefe, good afternoonconst user = await User.create({
  fullName: fullName.trim(),
  email: normalizedEmail,
  password: hash,
  phone,
  role: role || "guest",
});
const token = createToken(user);

const safeUser = await User.findById(user._id).select("-password");

res.status(201).json({
  success: true,
  token,
  user: safeUser,
});  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===================== LOGIN =====================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

   const user = await User.findOne({
  email: normalizedEmail,
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

const safeUser = await User.findById(user._id).select("-password");

res.json({
  success: true,
  token,
  user: safeUser,
});

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===================== CURRENT USER =====================

export const me = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  res.json(user);
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

    const otp = await OtpSession.findOne({
      email: email.toLowerCase(),
      otpCode,
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

    res.json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};