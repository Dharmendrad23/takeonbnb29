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