import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: role || "guest",
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    console.log('[AuthController] Login request received');
    console.log('[AuthController] Request body:', { email: req.body.email, hasPassword: !!req.body.password });

    const { email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail || !password) {
      console.log('[AuthController] Missing email or password');
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    console.log('[AuthController] Looking up user by email:', normalizedEmail);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.log('[AuthController] User not found:', normalizedEmail);
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    console.log('[AuthController] User found, checking password...');
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      console.log('[AuthController] Password mismatch for user:', normalizedEmail);
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    console.log('[AuthController] Password matched, generating JWT...');
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

    console.log('[AuthController] JWT generated, sending response...');
    console.log('[AuthController] User role:', user.role);
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        userType: user.role,
      },
    });
    console.log('[AuthController] Login response sent successfully');

  } catch (err) {
    console.error('[AuthController] Login error:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
    });

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};