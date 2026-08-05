import express from "express";
import User from "../models/User.js";

const router = express.Router();

// GET /users - list all users (admin use, returns count metadata)
router.get("/", async (req, res) => {
  try {
    const { role } = req.query;
    // Sanitize: only allow valid role strings to prevent NoSQL injection
    const VALID_ROLES = ['guest', 'host', 'admin'];
    const query = role && typeof role === 'string' && VALID_ROLES.includes(role) ? { role } : {};
    const users = await User.find(query, "-password").sort({ createdAt: -1 });
    res.json({ items: users, totalItems: users.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    // Only allow safe profile fields — never allow password change via this route
    const { name, phone, avatar } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = String(name);
    if (phone !== undefined) updateData.phone = String(phone);
    if (avatar !== undefined) updateData.avatar = String(avatar);
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
