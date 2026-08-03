import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /users - list users (admin)
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.search) {
      const s = new RegExp(req.query.search, "i");
      filter.$or = [{ fullName: s }, { email: s }];
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      users,
      items: users,
      total,
      totalItems: total,
      page,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /users/:id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /users/:id (admin or self update)
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { fullName, phone, profileImage, role } = req.body;
    const update = {};
    if (fullName) update.fullName = fullName;
    if (phone !== undefined) update.phone = phone;
    if (profileImage !== undefined) update.profileImage = profileImage;
    // Only allow role update if caller is admin
    if (role && req.user?.role === "admin") update.role = role;

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /users/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin only" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
