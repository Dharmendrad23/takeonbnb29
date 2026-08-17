import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

/* =========================================
   HELPER: CREATE JWT TOKEN
========================================= */

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};


/* =========================================
   HELPER: FORMAT USER
========================================= */

const formatUser = (user) => {
  return {
    _id: user._id,
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    bio: user.bio || "",
    role: user.role,
    userType: user.role,
  };
};


/* =========================================
   REGISTER
========================================= */

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role || "guest",
    });

    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: formatUser(user),
    });

  } catch (err) {
    console.error("[AuthController] Registration error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Registration failed",
    });
  }
};


/* =========================================
   LOGIN
========================================= */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = createToken(user);

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: formatUser(user),
    });

  } catch (err) {
    console.error("[AuthController] Login error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Login failed",
    });
  }
};


/* =========================================
   GET CURRENT PROFILE
========================================= */

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user: formatUser(user),
    });

  } catch (err) {
    console.error("[AuthController] Get profile error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Failed to load profile",
    });
  }
};


/* =========================================
   UPDATE PROFILE
========================================= */

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { name, phone, bio } = req.body;

    const updateData = {};

    if (name !== undefined) {
      const cleanName = String(name).trim();

      if (!cleanName) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }

      updateData.name = cleanName;
    }

    if (phone !== undefined) {
      updateData.phone = String(phone).trim();
    }

    if (bio !== undefined) {
      updateData.bio = String(bio).trim();
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: formatUser(user),
    });

  } catch (err) {
    console.error("[AuthController] Update profile error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update profile",
    });
  }
};