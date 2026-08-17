import User from "../models/User.js";

/* =========================================
   GET USERS BY IDS
========================================= */

// GET /users?ids=id1,id2,id3
export const getUsersByIds = async (req, res) => {
  try {
    const idsParam = req.query.ids;

    if (!idsParam) {
      return res.json([]);
    }

    const ids = String(idsParam)
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    const users = await User.find({
      _id: { $in: ids },
    }).select("name email role phone avatar bio");

    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================================
   GET SINGLE USER
========================================= */

// GET /users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id
    ).select("name email role phone avatar bio");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Get user error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================================
   UPDATE USER PROFILE
========================================= */

// PUT /users/:id
export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, bio } = req.body;

    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) {
      user.name = String(name).trim();
    }

    if (phone !== undefined) {
      user.phone = String(phone).trim();
    }

    if (bio !== undefined) {
      user.bio = String(bio).trim();
    }

    await user.save();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        userType: user.role,
        phone: user.phone || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
      },
    });

  } catch (err) {
    console.error("Update profile error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update profile",
    });
  }
};